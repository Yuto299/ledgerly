import { describe, it, expect } from "vitest";
import { calculateTotal, calculateTax } from "@/lib/money/calculator";

describe("calculateTotal", () => {
  it("単価と数量から合計金額を正しく計算する", () => {
    expect(calculateTotal(1000, 2)).toBe(2000);
    expect(calculateTotal(1500, 3)).toBe(4500);
  });

  it("0円の場合を正しく処理する", () => {
    expect(calculateTotal(0, 10)).toBe(0);
    expect(calculateTotal(1000, 0)).toBe(0);
  });

  it("小数点を含む計算を正しく処理する", () => {
    expect(calculateTotal(1000.5, 2)).toBe(2001);
  });

  it("負の値を正しく処理する", () => {
    expect(calculateTotal(-1000, 2)).toBe(-2000);
  });
});

describe("calculateTax", () => {
  it("税額を正しく計算する（10%）", () => {
    expect(calculateTax(1000, 10)).toBe(100);
    expect(calculateTax(1500, 10)).toBe(150);
  });

  it("0円の税額を正しく処理する", () => {
    expect(calculateTax(0, 10)).toBe(0);
  });

  it("税率0%を正しく処理する", () => {
    expect(calculateTax(1000, 0)).toBe(0);
  });

  it("小数点以下を四捨五入する", () => {
    expect(calculateTax(1001, 10)).toBe(100);
    expect(calculateTax(1005, 10)).toBe(101);
  });
});
