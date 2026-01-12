import { z } from "zod";

/**
 * 案件作成スキーマ
 */
export const createProjectSchema = z.object({
  customerId: z.string().uuid("有効な顧客IDを選択してください"),
  name: z
    .string()
    .min(1, "案件名は必須です")
    .max(255, "案件名は255文字以内で入力してください"),
  description: z.string().optional(),
  contractType: z.enum(["FIXED", "HOURLY", "COMMISSION"]),
  contractAmount: z
    .number()
    .min(0, "契約金額は0以上で入力してください")
    .optional(),
  hourlyRate: z.number().min(0, "時給は0以上で入力してください").optional(),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "有効な日付を入力してください",
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "有効な日付を入力してください",
    }),
  status: z
    .enum(["PROSPECT", "IN_PROGRESS", "COMPLETED", "LOST"])
    .default("PROSPECT"),
});

/**
 * 案件更新スキーマ
 */
export const updateProjectSchema = createProjectSchema.partial();

/**
 * 案件レスポンススキーマ
 */
export const projectResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  customerId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  contractType: z.enum(["FIXED", "HOURLY", "COMMISSION"]),
  contractAmount: z.number().nullable(),
  hourlyRate: z.number().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  status: z.enum(["PROSPECT", "IN_PROGRESS", "COMPLETED", "LOST"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  customer: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
});

/**
 * 案件一覧レスポンススキーマ
 */
export const projectListResponseSchema = z.object({
  projects: z.array(projectResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

/**
 * 案件詳細レスポンススキーマ
 */
export const projectDetailResponseSchema = z.object({
  project: projectResponseSchema,
  invoicesSummary: z.object({
    totalInvoiced: z.number(),
    totalPaid: z.number(),
    unpaid: z.number(),
  }),
  invoiceCount: z.number(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
export type ProjectDetailResponse = z.infer<typeof projectDetailResponseSchema>;
