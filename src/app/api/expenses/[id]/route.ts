import { NextRequest, NextResponse } from "next/server";
import { getExpenseById } from "@/application/usecases/expenses/getExpenseById";
import { updateExpense } from "@/application/usecases/expenses/updateExpense";
import { deleteExpense } from "@/application/usecases/expenses/deleteExpense";
import { getUserId } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/errorHandler";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/expenses/:id
 * 経費詳細取得
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId();
    const { id: expenseId } = await context.params;

    const result = await getExpenseById(userId, expenseId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/expenses/:id
 * 経費更新
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId();
    const { id: expenseId } = await context.params;
    const body = await request.json();

    const expense = await updateExpense(userId, expenseId, body);

    return NextResponse.json(expense);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/expenses/:id
 * 経費削除
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId();
    const { id: expenseId } = await context.params;

    const result = await deleteExpense(userId, expenseId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
