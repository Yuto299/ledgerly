import { expenseRepository } from "@/infrastructure/repositories/expenseRepository";

/**
 * 経費一覧取得ユースケース
 */
export async function listExpenses(
  userId: string,
  options: {
    projectId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const {
    projectId,
    categoryId,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = options;

  const { expenses, total } = await expenseRepository.findMany(userId, {
    projectId,
    categoryId,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    page,
    limit,
  });

  return {
    expenses,
    total,
    page,
    limit,
  };
}
