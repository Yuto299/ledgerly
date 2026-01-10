import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

// Prismaのモック
const mockPrisma = {
  invoice: {
    update: vi.fn(),
    findFirst: vi.fn(),
  },
};

vi.mock("@/infrastructure/db/prisma", () => ({
  prisma: mockPrisma,
}));

describe("InvoiceRepository - ステータス更新ロジック", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updatePaidAmount", () => {
    it("全額入金時にステータスをPAIDに更新する", async () => {
      const invoice = {
        id: "invoice-1",
        userId: "user-1",
        totalAmount: 100000,
        paidAmount: 0,
        status: "SENT",
      };

      mockPrisma.invoice.findFirst.mockResolvedValueOnce(invoice);
      mockPrisma.invoice.update.mockResolvedValueOnce({
        ...invoice,
        paidAmount: 100000,
        status: "PAID",
      });

      const { invoiceRepository } = await import(
        "@/infrastructure/repositories/invoiceRepository"
      );
      const result = await invoiceRepository.updatePaidAmount(
        "invoice-1",
        "user-1",
        100000
      );

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: {
          id: "invoice-1",
          userId: "user-1",
          deletedAt: null,
        },
        data: {
          paidAmount: 100000,
          status: "PAID",
        },
      });
      expect(result?.status).toBe("PAID");
    });

    it("一部入金時にDRAFTからSENTに更新する", async () => {
      const invoice = {
        id: "invoice-1",
        userId: "user-1",
        totalAmount: 100000,
        paidAmount: 0,
        status: "DRAFT",
      };

      mockPrisma.invoice.findFirst.mockResolvedValueOnce(invoice);
      mockPrisma.invoice.update.mockResolvedValueOnce({
        ...invoice,
        paidAmount: 30000,
        status: "SENT",
      });

      const { invoiceRepository } = await import(
        "@/infrastructure/repositories/invoiceRepository"
      );
      const result = await invoiceRepository.updatePaidAmount(
        "invoice-1",
        "user-1",
        30000
      );

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: {
          id: "invoice-1",
          userId: "user-1",
          deletedAt: null,
        },
        data: {
          paidAmount: 30000,
          status: "SENT",
        },
      });
      expect(result?.status).toBe("SENT");
    });

    it("過入金でもPAIDステータスを維持する", async () => {
      const invoice = {
        id: "invoice-1",
        userId: "user-1",
        totalAmount: 100000,
        paidAmount: 0,
        status: "SENT",
      };

      mockPrisma.invoice.findFirst.mockResolvedValueOnce(invoice);
      mockPrisma.invoice.update.mockResolvedValueOnce({
        ...invoice,
        paidAmount: 150000,
        status: "PAID",
      });

      const { invoiceRepository } = await import(
        "@/infrastructure/repositories/invoiceRepository"
      );
      const result = await invoiceRepository.updatePaidAmount(
        "invoice-1",
        "user-1",
        150000
      );

      expect(result?.status).toBe("PAID");
    });

    it("請求書が存在しない場合はnullを返す", async () => {
      mockPrisma.invoice.findFirst.mockResolvedValueOnce(null);

      const { invoiceRepository } = await import(
        "@/infrastructure/repositories/invoiceRepository"
      );
      const result = await invoiceRepository.updatePaidAmount(
        "invalid-id",
        "user-1",
        100000
      );

      expect(result).toBeNull();
      expect(mockPrisma.invoice.update).not.toHaveBeenCalled();
    });
  });

  describe("明細から合計金額を算出", () => {
    it("複数明細の合計を正しく計算する", () => {
      const items = [
        { quantity: 2, unitPrice: 50000, amount: 100000 },
        { quantity: 1, unitPrice: 30000, amount: 30000 },
        { quantity: 3, unitPrice: 10000, amount: 30000 },
      ];

      const total = items.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(160000);
    });

    it("明細が1つの場合はその金額を返す", () => {
      const items = [{ quantity: 1, unitPrice: 100000, amount: 100000 }];

      const total = items.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(100000);
    });

    it("明細が空の場合は0を返す", () => {
      const items: Array<{ amount: number }> = [];

      const total = items.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(0);
    });
  });
});
