import { customerRepository } from '@/infrastructure/repositories/customerRepository'
import { UpdateCustomerDto } from '@/features/customers/schemas/customerSchema'
import { NotFoundError } from '@/lib/api/errors'

/**
 * 顧客更新ユースケース
 */
export async function updateCustomer(
  id: string,
  userId: string,
  data: UpdateCustomerDto
) {
  // 存在確認
  const existing = await customerRepository.findById(id, userId)
  if (!existing) {
    throw new NotFoundError('顧客が見つかりません')
  }

  return await customerRepository.update(id, userId, data)
}
