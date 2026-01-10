import { z } from "zod";

/**
 * 経費カテゴリ作成スキーマ
 */
export const createExpenseCategorySchema = z.object({
  name: z.string().min(1, "カテゴリ名を入力してください"),
  color: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

/**
 * 経費カテゴリ更新スキーマ
 */
export const updateExpenseCategorySchema =
  createExpenseCategorySchema.partial();

/**
 * 経費カテゴリレスポンススキーマ
 */
export const expenseCategoryResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 経費カテゴリ一覧レスポンススキーマ
 */
export const expenseCategoryListResponseSchema = z.object({
  categories: z.array(expenseCategoryResponseSchema),
});

export type CreateExpenseCategoryDto = z.infer<
  typeof createExpenseCategorySchema
>;
export type UpdateExpenseCategoryDto = z.infer<
  typeof updateExpenseCategorySchema
>;
export type ExpenseCategoryResponse = z.infer<
  typeof expenseCategoryResponseSchema
>;
export type ExpenseCategoryListResponse = z.infer<
  typeof expenseCategoryListResponseSchema
>;
