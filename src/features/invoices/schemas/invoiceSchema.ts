import { z } from "zod";

/**
 * 請求明細作成スキーマ
 */
export const createInvoiceItemSchema = z.object({
  description: z
    .string()
    .min(1, "明細説明は必須です")
    .max(500, "明細説明は500文字以内で入力してください"),
  quantity: z.number().min(1, "数量は1以上で入力してください"),
  unitPrice: z.number().min(0, "単価は0以上で入力してください"),
  hours: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    if (isNaN(num)) return undefined;
    return num;
  }, z.number().min(0, "稼働時間は0以上で入力してください").optional()),
});

/**
 * 請求書作成スキーマ
 */
export const createInvoiceSchema = z.object({
  customerId: z.string().uuid("有効な顧客IDを選択してください"),
  projectId: z.string().uuid("有効な案件IDを選択してください"),
  invoiceNumber: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "PAID"]).optional(),
  issuedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "有効な請求日を入力してください",
  }),
  dueAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "有効な支払期限を入力してください",
  }),
  notes: z.string().optional(),
  items: z.array(createInvoiceItemSchema).min(1, "最低1つの明細が必要です"),
});

/**
 * 請求書更新スキーマ
 */
export const updateInvoiceSchema = z.object({
  customerId: z.string().uuid("有効な顧客IDを選択してください").optional(),
  projectId: z.string().uuid("有効な案件IDを選択してください").optional(),
  invoiceNumber: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "PAID"]).optional(),
  issuedAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "有効な請求日を入力してください",
    }),
  dueAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "有効な支払期限を入力してください",
    }),
  notes: z.string().optional(),
  items: z.array(createInvoiceItemSchema).optional(),
});

/**
 * 請求明細レスポンススキーマ
 */
export const invoiceItemResponseSchema = z.object({
  id: z.string().uuid(),
  invoiceId: z.string().uuid(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
  hours: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 請求書レスポンススキーマ
 */
export const invoiceResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  customerId: z.string().uuid(),
  projectId: z.string().uuid(),
  invoiceNumber: z.string().nullable(),
  status: z.enum(["DRAFT", "SENT", "PAID"]),
  issuedAt: z.date(),
  dueAt: z.date(),
  totalAmount: z.number(),
  paidAmount: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customer: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  project: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  items: z.array(invoiceItemResponseSchema).optional(),
  payments: z.array(z.any()).optional(),
});

/**
 * 請求書一覧レスポンススキーマ
 */
export const invoiceListResponseSchema = z.object({
  invoices: z.array(invoiceResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

/**
 * 請求書詳細レスポンススキーマ
 */
export const invoiceDetailResponseSchema = z.object({
  invoice: invoiceResponseSchema,
});

export type CreateInvoiceItemDto = z.infer<typeof createInvoiceItemSchema>;
export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
export type InvoiceItemResponse = z.infer<typeof invoiceItemResponseSchema>;
export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
export type InvoiceListResponse = z.infer<typeof invoiceListResponseSchema>;
export type InvoiceDetailResponse = z.infer<typeof invoiceDetailResponseSchema>;
