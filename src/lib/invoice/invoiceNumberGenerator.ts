import { prisma } from "@/infrastructure/db/prisma";

/**
 * 請求書番号を自動生成
 * フォーマット: INV-YYYYMM-XXXX (例: INV-202601-0001)
 */
export async function generateInvoiceNumber(userId: string): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `INV-${year}${month}-`;

  // 同じユーザーの同じ月の請求書番号の最大値を取得
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      userId,
      invoiceNumber: {
        startsWith: prefix,
      },
      deletedAt: null,
    },
    orderBy: {
      invoiceNumber: "desc",
    },
    select: {
      invoiceNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastInvoice?.invoiceNumber) {
    // 末尾の数字を取り出して+1
    const lastNumber = parseInt(
      lastInvoice.invoiceNumber.split("-").pop() || "0",
      10
    );
    nextNumber = lastNumber + 1;
  }

  // 4桁ゼロパディング
  const paddedNumber = String(nextNumber).padStart(4, "0");
  return `${prefix}${paddedNumber}`;
}
