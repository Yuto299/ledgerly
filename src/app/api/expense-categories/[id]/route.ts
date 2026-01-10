import { NextRequest, NextResponse } from "next/server";
import { updateExpenseCategory } from "@/application/usecases/expense-categories/updateExpenseCategory";
import { deleteExpenseCategory } from "@/application/usecases/expense-categories/deleteExpenseCategory";
import { getUserId } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/errorHandler";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PUT /api/expense-categories/:id
 * 経費カテゴリ更新
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId();
    const { id: categoryId } = await context.params;
    const body = await request.json();

    const category = await updateExpenseCategory(userId, categoryId, body);

    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/expense-categories/:id
 * 経費カテゴリ削除
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getUserId();
    const { id: categoryId } = await context.params;

    const result = await deleteExpenseCategory(userId, categoryId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
