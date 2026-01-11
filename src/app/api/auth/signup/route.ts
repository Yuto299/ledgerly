import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/infrastructure/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // バリデーション
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "すべてのフィールドを入力してください" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "パスワードは6文字以上で設定してください" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "ユーザー登録が完了しました",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
