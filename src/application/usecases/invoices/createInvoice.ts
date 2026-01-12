import { invoiceRepository } from "@/infrastructure/repositories/invoiceRepository";
import {
  CreateInvoiceDto,
  createInvoiceSchema,
} from "@/features/invoices/schemas/invoiceSchema";
import { generateInvoiceNumber } from "@/lib/invoice/invoiceNumberGenerator";

/**
 * 請求書作成ユースケース
 */
export async function createInvoice(userId: string, data: CreateInvoiceDto) {
  console.log("createInvoice received data:", JSON.stringify(data, null, 2));

  // バリデーション
  const validatedData = createInvoiceSchema.parse(data);

  console.log(
    "createInvoice validated data:",
    JSON.stringify(validatedData, null, 2)
  );

  // 請求書番号を自動生成（入力されていない場合）
  const invoiceNumber =
    validatedData.invoiceNumber || (await generateInvoiceNumber(userId));

  // 明細から合計金額を計算（時給契約の場合は時間×単価、通常は数量×単価）
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

  console.log("Creating invoice with items:", JSON.stringify(items, null, 2));

  // 請求書作成
  const invoice = await invoiceRepository.create({
    userId,
    customerId: validatedData.customerId,
    projectId: validatedData.projectId,
    invoiceNumber,
    status: validatedData.status,
    issuedAt: new Date(validatedData.issuedAt),
    dueAt: new Date(validatedData.dueAt),
    totalAmount,
    notes: validatedData.notes,
    items,
  });

  return invoice;
}
