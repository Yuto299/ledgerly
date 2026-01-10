import { customerRepository } from '@/infrastructure/repositories/customerRepository'
import { CreateCustomerDto } from '@/features/customers/schemas/customerSchema'
import { NotFoundError } from '@/lib/api/errors'

/**
 * 顧客作成ユースケース
 */
export async function createCustomer(userId: string, data: CreateCustomerDto) {
  return await customerRepository.create(userId, data)
}
