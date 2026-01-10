import { expenseRepository } from "@/infrastructure/repositories/expenseRepository";
import { NotFoundError } from "@/lib/api/errors";

/**
 * 経費削除ユースケース
 */
export async function deleteExpense(userId: string, expenseId: string) {
  // 経費の存在確認
  const existingExpense = await expenseRepository.findById(expenseId, userId);
  if (!existingExpense) {
    throw new NotFoundError("経費が見つかりません");
  }

  // 経費を削除（論理削除）
  await expenseRepository.delete(expenseId, userId);

  return { success: true };
}
