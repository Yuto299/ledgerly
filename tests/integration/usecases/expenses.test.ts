import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/infrastructure/db/prisma";
import { createExpense } from "@/application/usecases/expenses/createExpense";
import { NotFoundError } from "@/lib/api/errors";

describe("経費登録の統合テスト", () => {
  let userId: string;
  let customerId: string;
  let projectId: string;
  let categoryId: string;

  beforeAll(async () => {
    // テスト用ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email: "expense-test@example.com",
        password: "test-password",
        name: "Expense Test User",
      },
    });
    userId = user.id;

    // テスト用顧客を作成
    const customer = await prisma.customer.create({
      data: {
        userId,
        name: "テスト顧客",
        email: "customer@example.com",
      },
    });
    customerId = customer.id;

    // テスト用案件を作成
    const project = await prisma.project.create({
      data: {
        userId,
        customerId,
        name: "テスト案件",
        status: "IN_PROGRESS",
        contractType: "FIXED",
      },
    });
    projectId = project.id;

    // テスト用カテゴリを作成
    const category = await prisma.expenseCategory.create({
      data: {
        userId,
        name: "テストカテゴリ",
        color: "#FF0000",
      },
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    // テストデータをクリーンアップ
    await prisma.expense.deleteMany({ where: { userId } });
    await prisma.expenseCategory.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { userId } });
    await prisma.customer.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  describe("createExpense", () => {
    it("案件に紐付く経費を作成できる", async () => {
      const expenseData = {
        projectId,
        categoryId,
        date: "2026-01-15",
        amount: 5000,
        paymentMethod: "CASH" as const,
        description: "交通費",
        notes: "打ち合わせ往復",
      };

      const expense = await createExpense(userId, expenseData);

      expect(expense).toBeDefined();
      expect(expense.amount).toBe(5000);
      expect(expense.projectId).toBe(projectId);
      expect(expense.categoryId).toBe(categoryId);
      expect(expense.description).toBe("交通費");
    });

    it("案件に紐付かない経費を作成できる", async () => {
      const expenseData = {
        categoryId,
        date: "2026-01-15",
        amount: 3000,
        paymentMethod: "CREDIT_CARD" as const,
        description: "備品購入",
      };

      const expense = await createExpense(userId, expenseData);

      expect(expense).toBeDefined();
      expect(expense.projectId).toBeNull();
      expect(expense.amount).toBe(3000);
    });

    it("存在しないカテゴリを指定するとエラーになる", async () => {
      const expenseData = {
        categoryId: "invalid-category-id",
        date: "2026-01-15",
        amount: 1000,
        paymentMethod: "CASH" as const,
        description: "テスト",
      };

      await expect(createExpense(userId, expenseData)).rejects.toThrow(
        NotFoundError
      );
    });

    it("存在しない案件を指定するとエラーになる", async () => {
      const expenseData = {
        projectId: "invalid-project-id",
        categoryId,
        date: "2026-01-15",
        amount: 1000,
        paymentMethod: "CASH" as const,
        description: "テスト",
      };

      await expect(createExpense(userId, expenseData)).rejects.toThrow(
        NotFoundError
      );
    });

    it("複数の経費を同じカテゴリに登録できる", async () => {
      const expense1 = await createExpense(userId, {
        categoryId,
        date: "2026-01-10",
        amount: 1000,
        paymentMethod: "CASH" as const,
        description: "経費1",
      });

      const expense2 = await createExpense(userId, {
        categoryId,
        date: "2026-01-15",
        amount: 2000,
        paymentMethod: "BANK_TRANSFER" as const,
        description: "経費2",
      });

      expect(expense1.categoryId).toBe(categoryId);
      expect(expense2.categoryId).toBe(categoryId);

      // カテゴリに紐付く経費を確認
      const expenses = await prisma.expense.findMany({
        where: { categoryId, userId },
      });

      expect(expenses.length).toBeGreaterThanOrEqual(2);
    });
  });
});
