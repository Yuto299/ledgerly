import { PrismaClient } from "@prisma/client";
import { DEFAULT_EXPENSE_CATEGORIES } from "../expenses/defaultCategories";

const prisma = new PrismaClient();

/**
 * ユーザー作成時にデフォルトの経費カテゴリを作成
 */
export async function createDefaultExpenseCategories(userId: string) {
  try {
    await prisma.expenseCategory.createMany({
      data: DEFAULT_EXPENSE_CATEGORIES.map((category) => ({
        userId,
        name: category.name,
        color: category.color,
        sortOrder: category.sortOrder,
      })),
    });
    console.log(`Created default expense categories for user: ${userId}`);
  } catch (error) {
    console.error("Failed to create default expense categories:", error);
    throw error;
  }
}
