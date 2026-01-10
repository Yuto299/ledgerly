import { customerRepository } from '@/infrastructure/repositories/customerRepository'

/**
 * 顧客一覧取得ユースケース
 */
export async function listCustomers(
  userId: string,
  options?: {
    page?: number
    limit?: number
  }
) {
  const { page = 1, limit = 50 } = options || {}
  const skip = (page - 1) * limit

  const { customers, total } = await customerRepository.findAll(userId, {
    skip,
    take: limit,
  })

  return {
    customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
