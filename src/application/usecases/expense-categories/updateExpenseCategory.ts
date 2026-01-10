import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";
import {
  UpdateExpenseCategoryDto,
  updateExpenseCategorySchema,
} from "@/features/expense-categories/schemas/expenseCategorySchema";
import { NotFoundError } from "@/lib/api/errors";

/**
 * 経費カテゴリ更新ユースケース
 */
export async function updateExpenseCategory(
  userId: string,
  categoryId: string,
  data: UpdateExpenseCategoryDto
) {
  // バリデーション
  const validatedData = updateExpenseCategorySchema.parse(data);

  // カテゴリの存在確認
  const existingCategory = await expenseCategoryRepository.findById(
    categoryId,
    userId
  );
  if (!existingCategory) {
    throw new NotFoundError("経費カテゴリが見つかりません");
  }

  // 経費カテゴリを更新
  const category = await expenseCategoryRepository.update(
    categoryId,
    userId,
    validatedData
  );

  return category;
}
