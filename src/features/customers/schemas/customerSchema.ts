import { z } from 'zod'

/**
 * 顧客作成スキーマ
 */
export const createCustomerSchema = z.object({
  name: z.string().min(1, '顧客名は必須です').max(100, '顧客名は100文字以内で入力してください'),
  contactName: z.string().max(100, '担当者名は100文字以内で入力してください').optional(),
  email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  phone: z.string().max(20, '電話番号は20文字以内で入力してください').optional(),
  notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
})

/**
 * 顧客更新スキーマ
 */
export const updateCustomerSchema = createCustomerSchema.partial()

/**
 * 顧客作成DTO型
 */
export type CreateCustomerDto = z.infer<typeof createCustomerSchema>

/**
 * 顧客更新DTO型
 */
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>
