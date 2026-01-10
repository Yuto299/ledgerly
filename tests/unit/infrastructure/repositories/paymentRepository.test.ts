import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

// Prismaのモック
const mockPrisma = {
  payment: {
    findMany: vi.fn(),
  },
};

vi.mock("@/infrastructure/db/prisma", () => ({
  prisma: mockPrisma,
}));

describe("PaymentRepository - 入金合計計算", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTotalPaidAmount", () => {
    it("複数の入金の合計を正しく計算する", async () => {
      const payments = [
        { amount: 50000, deletedAt: null },
        { amount: 30000, deletedAt: null },
        { amount: 20000, deletedAt: null },
      ];

      mockPrisma.payment.findMany.mockResolvedValueOnce(payments);

      const { paymentRepository } = await import(
        "@/infrastructure/repositories/paymentRepository"
      );
      const total = await paymentRepository.getTotalPaidAmount("invoice-1");

      expect(total).toBe(100000);
      expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
        where: {
          invoiceId: "invoice-1",
          deletedAt: null,
        },
        orderBy: {
          paidAt: "desc",
        },
      });
    });

    it("入金がない場合は0を返す", async () => {
      mockPrisma.payment.findMany.mockResolvedValueOnce([]);

      const { paymentRepository } = await import(
        "@/infrastructure/repositories/paymentRepository"
      );
      const total = await paymentRepository.getTotalPaidAmount("invoice-1");

      expect(total).toBe(0);
    });

    it("削除済み入金は合計に含めない", async () => {
      const payments = [
        { amount: 50000, deletedAt: null },
        { amount: 30000, deletedAt: new Date() }, // 削除済み
        { amount: 20000, deletedAt: null },
      ];

      mockPrisma.payment.findMany.mockResolvedValueOnce(
        payments.filter((p) => !p.deletedAt)
      );

      const { paymentRepository } = await import(
        "@/infrastructure/repositories/paymentRepository"
      );
      const total = await paymentRepository.getTotalPaidAmount("invoice-1");

      expect(total).toBe(70000); // 50000 + 20000のみ
    });

    it("単一の入金の場合はその金額を返す", async () => {
      mockPrisma.payment.findMany.mockResolvedValueOnce([
        { amount: 100000, deletedAt: null },
      ]);

      const { paymentRepository } = await import(
        "@/infrastructure/repositories/paymentRepository"
      );
      const total = await paymentRepository.getTotalPaidAmount("invoice-1");

      expect(total).toBe(100000);
    });
  });
});
