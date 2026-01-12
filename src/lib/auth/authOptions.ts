import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/infrastructure/db/prisma";
import { createDefaultExpenseCategories } from "./defaultData";

// 簡易的なログイン試行カウンター（本番環境では Redis 推奨）
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkLoginAttempts(email: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (!record || now > record.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }

  if (record.count >= 5) {
    return false;
  }

  record.count++;
  return true;
}

function resetLoginAttempts(email: string) {
  loginAttempts.delete(email);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // レートリミットチェック
        if (!checkLoginAttempts(credentials.email)) {
          throw new Error(
            "ログイン試行回数が上限に達しました。15分後に再度お試しください。"
          );
        }

        // ユーザー検索
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        // パスワード検証
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        // 成功したらカウンターをリセット
        resetLoginAttempts(credentials.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Googleログインの場合、ユーザーが存在しなければ作成
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // 新規ユーザーを作成（パスワードはランダム生成）
          const randomPassword = await bcrypt.hash(
            Math.random().toString(36),
            12
          );
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || user.email!.split("@")[0],
              password: randomPassword, // Googleログインユーザーは使用しない
            },
          });

          // デフォルトの経費カテゴリを作成
          await createDefaultExpenseCategories(newUser.id);

          // デフォルトの経費カテゴリを作成
          await createDefaultExpenseCategories(newUser.id);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // ユーザーIDを取得
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
