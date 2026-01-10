import { prisma } from "../db/prisma";

/**
 * 経費カテゴリリポジトリ
 */
export const expenseCategoryRepository = {
  /**
   * ユーザーの全経費カテゴリを取得
   */
  async findByUserId(userId: string) {
    return prisma.expenseCategory.findMany({
      where: { userId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  },

  /**
   * IDで経費カテゴリを取得
   */
  async findById(id: string, userId: string) {
    return prisma.expenseCategory.findFirst({
      where: { id, userId },
    });
  },

  /**
   * 経費カテゴリを作成
   */
  async create(data: {
    userId: string;
    name: string;
    color?: string;
    sortOrder?: number;
  }) {
    return prisma.expenseCategory.create({
      data: {
        userId: data.userId,
        name: data.name,
        color: data.color,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  },

  /**
   * 経費カテゴリを更新
   */
  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      color?: string;
      sortOrder?: number;
    }
  ) {
    return prisma.expenseCategory.update({
      where: { id, userId },
      data,
    });
  },

  /**
   * 経費カテゴリを削除
   */
  async delete(id: string, userId: string) {
    return prisma.expenseCategory.delete({
      where: { id, userId },
    });
  },

  /**
   * カテゴリが使用されているか確認
   */
  async isUsed(categoryId: string) {
    const count = await prisma.expense.count({
      where: {
        categoryId,
        deletedAt: null,
      },
    });
    return count > 0;
  },
};
