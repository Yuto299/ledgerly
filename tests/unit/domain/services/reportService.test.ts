import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { ReportService } from "@/domain/services/reportService";

// Prismaのモック
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    payment: {
      findMany: vi.fn(),
    },
    invoice: {
      findMany: vi.fn(),
    },
    expense: {
      findMany: vi.fn(),
    },
  };

  return {
    PrismaClient: vi.fn(() => mockPrisma),
  };
});

describe("ReportService", () => {
  const userId = "test-user-id";
  const month = "2026-01";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMonthlySummary", () => {
    it("月次サマリを正しく計算する", async () => {
      const prisma = new PrismaClient();

      // 入金データのモック
      vi.mocked(prisma.payment.findMany).mockResolvedValueOnce([
        { amount: 100000 } as any,
        { amount: 150000 } as any,
      ]);

      // 請求書データのモック
      vi.mocked(prisma.invoice.findMany)
        .mockResolvedValueOnce([
          { totalAmount: 300000 } as any,
          { totalAmount: 200000 } as any,
        ])
        .mockResolvedValueOnce([
          { totalAmount: 500000, paidAmount: 250000 } as any,
        ]);

      // 経費データのモック
      vi.mocked(prisma.expense.findMany).mockResolvedValueOnce([
        { amount: 50000 } as any,
        { amount: 30000 } as any,
      ]);

      const result = await ReportService.getMonthlySummary(userId, month);

      expect(result.month).toBe(month);
      expect(result.revenue).toBe(250000); // 入金合計
      expect(result.billedAmount).toBe(500000); // 請求額合計
      expect(result.expenses).toBe(80000); // 経費合計
      expect(result.profit).toBe(170000); // 利益（売上 - 経費）
      expect(result.unpaidAmount).toBe(250000); // 未回収
    });

    it("データがない場合はすべて0を返す", async () => {
      const prisma = new PrismaClient();

      vi.mocked(prisma.payment.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.invoice.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      vi.mocked(prisma.expense.findMany).mockResolvedValueOnce([]);

      const result = await ReportService.getMonthlySummary(userId, month);

      expect(result.revenue).toBe(0);
      expect(result.billedAmount).toBe(0);
      expect(result.expenses).toBe(0);
      expect(result.profit).toBe(0);
      expect(result.unpaidAmount).toBe(0);
    });
  });
});
