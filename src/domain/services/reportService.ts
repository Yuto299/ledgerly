import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth, format } from "date-fns";

const prisma = new PrismaClient();

export interface MonthlySummary {
  month: string; // YYYY-MM
  revenue: number; // 売上（入金ベース）
  billedAmount: number; // 請求額（請求ベース）
  expenses: number; // 経費
  profit: number; // 利益（売上 - 経費）
  unpaidAmount: number; // 未回収金額
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  count: number;
}

export interface ProjectSales {
  projectId: string;
  projectName: string;
  totalBilled: number;
  totalPaid: number;
  unpaidAmount: number;
}

export class ReportService {
  /**
   * 月次サマリを取得
   */
  static async getMonthlySummary(
    userId: string,
    month: string // YYYY-MM
  ): Promise<MonthlySummary> {
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = startOfMonth(new Date(year, monthNum - 1));
    const endDate = endOfMonth(new Date(year, monthNum - 1));

    // 売上（入金ベース）：当月に入金された金額
    const payments = await prisma.payment.findMany({
      where: {
        invoice: { userId, deletedAt: null },
        paidAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { amount: true },
    });
    const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // 請求額（請求ベース）：当月が支払期限の請求書の合計
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        deletedAt: null,
        dueAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { totalAmount: true },
    });
    const billedAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

    // 経費：当月に発生した経費
    const expenseRecords = await prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { amount: true },
    });
    const expenses = expenseRecords.reduce((sum, e) => sum + e.amount, 0);

    // 利益（入金ベース）
    const profit = revenue - expenses;

    // 未回収金額：すべての請求書の未入金合計
    const allInvoices = await prisma.invoice.findMany({
      where: {
        userId,
        deletedAt: null,
        status: { in: ["SENT", "PAID"] },
      },
      select: { totalAmount: true, paidAmount: true },
    });
    const unpaidAmount = allInvoices.reduce(
      (sum, i) => sum + (i.totalAmount - i.paidAmount),
      0
    );

    return {
      month,
      revenue,
      billedAmount,
      expenses,
      profit,
      unpaidAmount,
    };
  }

  /**
   * 月別推移データを取得（過去N ヶ月）
   */
  static async getMonthlyTrend(
    userId: string,
    months: number = 6
  ): Promise<MonthlyTrend[]> {
    const results: MonthlyTrend[] = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = format(targetDate, "yyyy-MM");
      const startDate = startOfMonth(targetDate);
      const endDate = endOfMonth(targetDate);

      // 売上（入金ベース）
      const payments = await prisma.payment.findMany({
        where: {
          invoice: { userId, deletedAt: null },
          paidAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { amount: true },
      });
      const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

      // 経費
      const expenseRecords = await prisma.expense.findMany({
        where: {
          userId,
          deletedAt: null,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { amount: true },
      });
      const expenses = expenseRecords.reduce((sum, e) => sum + e.amount, 0);

      results.push({
        month,
        revenue,
        expenses,
        profit: revenue - expenses,
      });
    }

    return results;
  }

  /**
   * 経費カテゴリ別内訳を取得
   */
  static async getExpenseBreakdown(
    userId: string,
    month?: string // YYYY-MM（省略時は全期間）
  ): Promise<ExpenseBreakdown[]> {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      startDate = startOfMonth(new Date(year, monthNum - 1));
      endDate = endOfMonth(new Date(year, monthNum - 1));
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        category: true,
      },
    });

    const categoryMap = new Map<string, ExpenseBreakdown>();

    for (const expense of expenses) {
      const categoryId = expense.categoryId;
      const categoryName = expense.category.name;
      const categoryColor = expense.category.color || "#gray-500";

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId,
          categoryName,
          categoryColor,
          amount: 0,
          count: 0,
        });
      }

      const breakdown = categoryMap.get(categoryId)!;
      breakdown.amount += expense.amount;
      breakdown.count += 1;
    }

    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
  }

  /**
   * 案件別売上を取得
   */
  static async getProjectSales(
    userId: string,
    month?: string // YYYY-MM（省略時は全期間）
  ): Promise<ProjectSales[]> {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      startDate = startOfMonth(new Date(year, monthNum - 1));
      endDate = endOfMonth(new Date(year, monthNum - 1));
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(startDate &&
          endDate && {
            dueAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        project: true,
      },
    });

    const projectMap = new Map<string, ProjectSales>();

    for (const invoice of invoices) {
      const projectId = invoice.projectId;
      const projectName = invoice.project.name;

      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          projectId,
          projectName,
          totalBilled: 0,
          totalPaid: 0,
          unpaidAmount: 0,
        });
      }

      const sales = projectMap.get(projectId)!;
      sales.totalBilled += invoice.totalAmount;
      sales.totalPaid += invoice.paidAmount;
      sales.unpaidAmount += invoice.totalAmount - invoice.paidAmount;
    }

    return Array.from(projectMap.values()).sort(
      (a, b) => b.totalBilled - a.totalBilled
    );
  }

  /**
   * 最近の請求書を取得
   */
  static async getRecentInvoices(userId: string, limit: number = 5) {
    return await prisma.invoice.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        customer: true,
        project: true,
      },
      orderBy: { issuedAt: "desc" },
      take: limit,
    });
  }

  /**
   * 最近の経費を取得
   */
  static async getRecentExpenses(userId: string, limit: number = 5) {
    return await prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
