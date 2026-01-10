import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";
import {
  CreateExpenseCategoryDto,
  createExpenseCategorySchema,
} from "@/features/expense-categories/schemas/expenseCategorySchema";

/**
 * 経費カテゴリ作成ユースケース
 */
export async function createExpenseCategory(
  userId: string,
  data: CreateExpenseCategoryDto
) {
  // バリデーション
  const validatedData = createExpenseCategorySchema.parse(data);

  // 経費カテゴリを作成
  const category = await expenseCategoryRepository.create({
    userId,
    name: validatedData.name,
    color: validatedData.color,
    sortOrder: validatedData.sortOrder,
  });

  return category;
}
