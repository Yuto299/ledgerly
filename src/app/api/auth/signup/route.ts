import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/infrastructure/db/prisma";
import { strongPasswordSchema } from "@/lib/security/password";
import { checkRateLimit, getIdentifier } from "@/lib/security/rateLimit";
import { z } from "zod";
import { createDefaultExpenseCategories } from "@/lib/auth/defaultData";

const signupSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: strongPasswordSchema,
});

export async function POST(req: NextRequest) {
  try {
    // レートリミット: 15分で5回まで
    const identifier = getIdentifier(req);
    const rateLimit = checkRateLimit(identifier, {
      interval: 15 * 60 * 1000, // 15分
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "リクエストが多すぎます。しばらくしてから再度お試しください。",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const body = await req.json();

    // バリデーション
    const validatedData = signupSchema.parse(body);

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化（12ラウンドに強化）
    const hashedPassword = await hash(validatedData.password, 12);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // デフォルトの経費カテゴリを作成
    await createDefaultExpenseCategories(user.id);

    return NextResponse.json(
      {
        message: "ユーザー登録が完了しました",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
