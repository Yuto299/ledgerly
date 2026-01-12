import { invoiceRepository } from "@/infrastructure/repositories/invoiceRepository";
import {
  UpdateInvoiceDto,
  updateInvoiceSchema,
} from "@/features/invoices/schemas/invoiceSchema";
import { NotFoundError } from "@/lib/api/errors";

/**
 * 請求書更新ユースケース
 */
export async function updateInvoice(
  userId: string,
  invoiceId: string,
  data: UpdateInvoiceDto
) {
  // バリデーション
  const validatedData = updateInvoiceSchema.parse(data);

  // 請求書の存在確認
  const existingInvoice = await invoiceRepository.findById(invoiceId, userId);
  if (!existingInvoice) {
    throw new NotFoundError("請求書が見つかりません");
  }

  // 明細が更新される場合
  if (validatedData.items) {
    // 既存の明細を全て削除
    await invoiceRepository.deleteAllItems(invoiceId);

    // 新しい明細から合計金額を計算（時給契約の場合は時間×単価、通常は数量×単価）
    const totalAmount = validatedData.items.reduce((sum, item) => {
      if (item.hours && item.hours > 0) {
        return sum + item.hours * item.unitPrice;
      }
      return sum + item.quantity * item.unitPrice;
    }, 0);

    // 明細データを変換
    const items = validatedData.items.map((item, index) => {
      const amount =
        item.hours && item.hours > 0
          ? item.hours * item.unitPrice
          : item.quantity * item.unitPrice;

      return {
        name: item.description,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        hours: item.hours ?? undefined,
        amount,
        sortOrder: index,
      };
    });

    // 明細と合計金額を含めて更新
    await invoiceRepository.update(invoiceId, userId, {
      customerId: validatedData.customerId,
      projectId: validatedData.projectId,
      invoiceNumber: validatedData.invoiceNumber,
      status: validatedData.status,
      issuedAt: validatedData.issuedAt
        ? new Date(validatedData.issuedAt)
        : undefined,
      dueAt: validatedData.dueAt ? new Date(validatedData.dueAt) : undefined,
      totalAmount,
      notes: validatedData.notes,
    });

    // 新しい明細を作成
    for (const item of items) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId,
          ...item,
        },
      });
    }
  } else {
    // 明細以外のフィールドのみ更新
    await invoiceRepository.update(invoiceId, userId, {
      customerId: validatedData.customerId,
      projectId: validatedData.projectId,
      invoiceNumber: validatedData.invoiceNumber,
      status: validatedData.status,
      issuedAt: validatedData.issuedAt
        ? new Date(validatedData.issuedAt)
        : undefined,
      dueAt: validatedData.dueAt ? new Date(validatedData.dueAt) : undefined,
      notes: validatedData.notes,
    });
  }

  // 更新後の請求書を取得
  const invoice = await invoiceRepository.findById(invoiceId, userId);
  return invoice;
}

// prismaインポート追加
import { prisma } from "@/infrastructure/db/prisma";
