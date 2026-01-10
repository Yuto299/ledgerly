import { expenseRepository } from "@/infrastructure/repositories/expenseRepository";
import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";
import { projectRepository } from "@/infrastructure/repositories/projectRepository";
import {
  CreateExpenseDto,
  createExpenseSchema,
} from "@/features/expenses/schemas/expenseSchema";
import { NotFoundError } from "@/lib/api/errors";
import { PaymentMethod } from "@prisma/client";

/**
 * 経費作成ユースケース
 */
export async function createExpense(userId: string, data: CreateExpenseDto) {
  // バリデーション
  const validatedData = createExpenseSchema.parse(data);

  // カテゴリの存在確認
  const category = await expenseCategoryRepository.findById(
    validatedData.categoryId,
    userId
  );
  if (!category) {
    throw new NotFoundError("カテゴリが見つかりません");
  }

  // 案件の存在確認（指定されている場合）
  if (validatedData.projectId) {
    const project = await projectRepository.findById(
      userId,
      validatedData.projectId
    );
    if (!project) {
      throw new NotFoundError("案件が見つかりません");
    }
  }

  // 経費を作成
  const expense = await expenseRepository.create({
    userId,
    projectId: validatedData.projectId,
    categoryId: validatedData.categoryId,
    date: new Date(validatedData.date),
    amount: validatedData.amount,
    paymentMethod: validatedData.paymentMethod as PaymentMethod,
    description: validatedData.description,
    notes: validatedData.notes,
  });

  return expense;
}
