import { expenseCategoryRepository } from "@/infrastructure/repositories/expenseCategoryRepository";

/**
 * 経費カテゴリ一覧取得ユースケース
 */
export async function listExpenseCategories(userId: string) {
  const categories = await expenseCategoryRepository.findByUserId(userId);

  return { categories };
}
