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
  console.log("updateExpense called with:", { userId, expenseId, data });

  // バリデーション
  const validatedData = updateExpenseSchema.parse(data);
  console.log("Validated data:", validatedData);

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
  if (validatedData.projectId && validatedData.projectId !== "") {
    console.log(
      "Checking project existence for projectId:",
      validatedData.projectId
    );
    const project = await projectRepository.findById(
      validatedData.projectId,
      userId
    );
    console.log("Project found:", project);
    if (!project) {
      console.error(
        "Project not found for projectId:",
        validatedData.projectId,
        "userId:",
        userId
      );
      throw new NotFoundError("案件が見つかりません");
    }
  }

  // 経費を更新（undefinedのフィールドを除外）
  const updateData: {
    projectId?: string | null;
    categoryId?: string;
    date?: Date;
    amount?: number;
    paymentMethod?: PaymentMethod;
    description?: string;
    notes?: string;
  } = {};

  if (validatedData.projectId !== undefined) {
    updateData.projectId = validatedData.projectId || null;
  }
  if (validatedData.categoryId !== undefined) {
    updateData.categoryId = validatedData.categoryId;
  }
  if (validatedData.date !== undefined) {
    updateData.date = new Date(validatedData.date);
  }
  if (validatedData.amount !== undefined) {
    updateData.amount = validatedData.amount;
  }
  if (validatedData.paymentMethod !== undefined) {
    updateData.paymentMethod = validatedData.paymentMethod as PaymentMethod;
  }
  if (validatedData.description !== undefined) {
    updateData.description = validatedData.description;
  }
  if (validatedData.notes !== undefined) {
    updateData.notes = validatedData.notes;
  }

  console.log("Final updateData to be sent to repository:", updateData);

  const expense = await expenseRepository.update(expenseId, userId, updateData);

  console.log("Update successful, result:", expense);

  return expense;
}
