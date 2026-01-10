import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";
import { NotFoundError, ValidationError } from "@/lib/api/errors";

/**
 * 経費カテゴリ削除ユースケース
 */
export async function deleteExpenseCategory(
  userId: string,
  categoryId: string
) {
  // カテゴリの存在確認
  const existingCategory = await expenseCategoryRepository.findById(
    categoryId,
    userId
  );
  if (!existingCategory) {
    throw new NotFoundError("経費カテゴリが見つかりません");
  }

  // カテゴリが使用されているか確認
  const isUsed = await expenseCategoryRepository.isUsed(categoryId);
  if (isUsed) {
    throw new ValidationError(
      "このカテゴリは経費で使用されているため削除できません"
    );
  }

  // 経費カテゴリを削除
  await expenseCategoryRepository.delete(categoryId, userId);

  return { success: true };
}
