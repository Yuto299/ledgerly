import { z } from "zod";

/**
 * 経費作成スキーマ
 */
export const createExpenseSchema = z.object({
  projectId: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      return val;
    }),
  categoryId: z.string().uuid({ message: "カテゴリを選択してください" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "有効な日付を入力してください",
  }),
  amount: z.number().min(1, "金額は1円以上で入力してください"),
  paymentMethod: z.enum(["BANK_TRANSFER", "CREDIT_CARD", "CASH", "OTHER"]),
  description: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * 経費更新スキーマ
 */
export const updateExpenseSchema = createExpenseSchema.partial();

/**
 * 経費レスポンススキーマ
 */
export const expenseResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),
  date: z.date(),
  amount: z.number(),
  paymentMethod: z.enum(["BANK_TRANSFER", "CREDIT_CARD", "CASH", "OTHER"]),
  description: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  project: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      customerId: z.string().uuid(),
    })
    .nullable()
    .optional(),
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      color: z.string().nullable(),
    })
    .optional(),
});

/**
 * 経費一覧レスポンススキーマ
 */
export const expenseListResponseSchema = z.object({
  expenses: z.array(expenseResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
export type ExpenseResponse = z.infer<typeof expenseResponseSchema>;
export type ExpenseListResponse = z.infer<typeof expenseListResponseSchema>;
