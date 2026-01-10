import { NextRequest, NextResponse } from "next/server";
import { createExpenseCategory } from "@/application/usecases/expense-categories/createExpenseCategory";
import { listExpenseCategories } from "@/application/usecases/expense-categories/listExpenseCategories";
import { getUserId } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/errorHandler";

/**
 * GET /api/expense-categories
 * 経費カテゴリ一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const result = await listExpenseCategories(userId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/expense-categories
 * 経費カテゴリ作成
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const category = await createExpenseCategory(userId, body);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
