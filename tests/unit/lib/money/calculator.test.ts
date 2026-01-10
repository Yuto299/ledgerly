import { describe, it, expect } from "vitest";
import {
  calculateItemAmount,
  calculateInvoiceTotal,
  calculatePaidAmount,
  calculateUnpaidAmount,
  isFullyPaid,
} from "@/lib/money/calculator";

describe("金額計算ヘルパー関数", () => {
  describe("calculateItemAmount", () => {
    it("明細金額を正しく計算する", () => {
      expect(calculateItemAmount(3, 10000)).toBe(30000);
    });

    it("数量が0の場合は0を返す", () => {
      expect(calculateItemAmount(0, 10000)).toBe(0);
    });

    it("単価が0の場合は0を返す", () => {
      expect(calculateItemAmount(5, 0)).toBe(0);
    });

    it("小数点を含む計算を正しく処理する", () => {
      expect(calculateItemAmount(1.5, 10000)).toBe(15000);
    });
  });

  describe("calculateInvoiceTotal", () => {
    it("請求書の合計金額を正しく計算する", () => {
      const items = [{ amount: 100000 }, { amount: 50000 }, { amount: 30000 }];
      expect(calculateInvoiceTotal(items)).toBe(180000);
    });

    it("明細が空の場合は0を返す", () => {
      expect(calculateInvoiceTotal([])).toBe(0);
    });

    it("単一の明細の場合はその金額を返す", () => {
      expect(calculateInvoiceTotal([{ amount: 150000 }])).toBe(150000);
    });
  });

  describe("calculatePaidAmount", () => {
    it("入金合計を正しく計算する", () => {
      const payments = [
        { amount: 50000 },
        { amount: 30000 },
        { amount: 20000 },
      ];
      expect(calculatePaidAmount(payments)).toBe(100000);
    });

    it("入金がない場合は0を返す", () => {
      expect(calculatePaidAmount([])).toBe(0);
    });

    it("単一の入金の場合はその金額を返す", () => {
      expect(calculatePaidAmount([{ amount: 100000 }])).toBe(100000);
    });
  });

  describe("calculateUnpaidAmount", () => {
    it("未回収金額を正しく計算する", () => {
      expect(calculateUnpaidAmount(100000, 30000)).toBe(70000);
    });

    it("全額入金済みの場合は0を返す", () => {
      expect(calculateUnpaidAmount(100000, 100000)).toBe(0);
    });

    it("過入金の場合も0を返す", () => {
      expect(calculateUnpaidAmount(100000, 150000)).toBe(0);
    });

    it("未入金の場合は請求額をそのまま返す", () => {
      expect(calculateUnpaidAmount(100000, 0)).toBe(100000);
    });
  });

  describe("isFullyPaid", () => {
    it("全額入金済みの場合はtrueを返す", () => {
      expect(isFullyPaid(100000, 100000)).toBe(true);
    });

    it("過入金の場合もtrueを返す", () => {
      expect(isFullyPaid(100000, 150000)).toBe(true);
    });

    it("一部入金の場合はfalseを返す", () => {
      expect(isFullyPaid(100000, 50000)).toBe(false);
    });

    it("未入金の場合はfalseを返す", () => {
      expect(isFullyPaid(100000, 0)).toBe(false);
    });
  });
});
