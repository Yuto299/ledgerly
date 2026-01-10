import { expenseRepository } from "@/infrastructure/repositories/expenseRepository";
import { NotFoundError } from "@/lib/api/errors";

/**
 * 経費詳細取得ユースケース
 */
export async function getExpenseById(userId: string, expenseId: string) {
  const expense = await expenseRepository.findById(expenseId, userId);

  if (!expense) {
    throw new NotFoundError("経費が見つかりません");
  }

  return { expense };
}
