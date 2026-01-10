import { NextRequest, NextResponse } from "next/server";
import { createExpense } from "@/application/usecases/expenses/createExpense";
import { listExpenses } from "@/application/usecases/expenses/listExpenses";
import { getUserId } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/errorHandler";

/**
 * GET /api/expenses
 * 経費一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await listExpenses(userId, {
      projectId,
      categoryId,
      startDate,
      endDate,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/expenses
 * 経費作成
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const expense = await createExpense(userId, body);

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
