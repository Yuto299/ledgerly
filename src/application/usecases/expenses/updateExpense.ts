import { expenseRepository } from "@/infrastructure/repositories/expenseRepository";
import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";
import { projectRepository } from "@/infrastructure/repositories/projectRepository";
import {
  UpdateExpenseDto,
  updateExpenseSchema,
} from "@/features/expenses/schemas/expenseSchema";
import { NotFoundError } from "@/lib/api/errors";
import { PaymentMethod } from "@prisma/client";

/**
 * 経費更新ユースケース
 */
export async function updateExpense(
  userId: string,
  expenseId: string,
  data: UpdateExpenseDto
) {
  // バリデーション
  const validatedData = updateExpenseSchema.parse(data);

  // 経費の存在確認
  const existingExpense = await expenseRepository.findById(expenseId, userId);
  if (!existingExpense) {
    throw new NotFoundError("経費が見つかりません");
  }

  // カテゴリの存在確認（変更される場合）
  if (validatedData.categoryId) {
    const category = await expenseCategoryRepository.findById(
      validatedData.categoryId,
      userId
    );
    if (!category) {
      throw new NotFoundError("カテゴリが見つかりません");
    }
  }

  // 案件の存在確認（変更される場合）
  if (validatedData.projectId) {
    const project = await projectRepository.findById(
      userId,
      validatedData.projectId
    );
    if (!project) {
      throw new NotFoundError("案件が見つかりません");
    }
  }

  // 経費を更新
  const expense = await expenseRepository.update(expenseId, userId, {
    projectId: validatedData.projectId,
    categoryId: validatedData.categoryId,
    date: validatedData.date ? new Date(validatedData.date) : undefined,
    amount: validatedData.amount,
    paymentMethod: validatedData.paymentMethod as PaymentMethod | undefined,
    description: validatedData.description,
    notes: validatedData.notes,
  });

  return expense;
}
