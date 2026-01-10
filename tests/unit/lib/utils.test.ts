import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "@/lib/utils";

describe("formatCurrency", () => {
  it("正の金額を正しくフォーマットする", () => {
    expect(formatCurrency(1000)).toBe("¥1,000");
    expect(formatCurrency(1234567)).toBe("¥1,234,567");
  });

  it("0円を正しくフォーマットする", () => {
    expect(formatCurrency(0)).toBe("¥0");
  });

  it("負の金額を正しくフォーマットする", () => {
    expect(formatCurrency(-1000)).toBe("-¥1,000");
  });

  it("小数点以下を正しく処理する", () => {
    expect(formatCurrency(1000.5)).toBe("¥1,001");
    expect(formatCurrency(1000.4)).toBe("¥1,000");
  });
});

describe("formatDate", () => {
  it("Date型を正しくフォーマットする", () => {
    const date = new Date("2026-01-15");
    expect(formatDate(date)).toBe("2026/01/15");
  });

  it("文字列型を正しくフォーマットする", () => {
    expect(formatDate("2026-01-15")).toBe("2026/01/15");
  });

  it("nullを渡した場合にハイフンを返す", () => {
    expect(formatDate(null)).toBe("-");
  });

  it("undefinedを渡した場合にハイフンを返す", () => {
    expect(formatDate(undefined)).toBe("-");
  });

  it("無効な日付文字列を渡した場合にハイフンを返す", () => {
    expect(formatDate("invalid-date")).toBe("-");
  });

  it("カスタムフォーマットを適用できる", () => {
    const date = new Date("2026-01-15");
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2026-01-15");
  });
});
