import { customerRepository } from '@/infrastructure/repositories/customerRepository'
import { NotFoundError } from '@/lib/api/errors'

/**
 * 顧客詳細取得ユースケース
 */
export async function getCustomerById(id: string, userId: string) {
  const customer = await customerRepository.findById(id, userId)
  
  if (!customer) {
    throw new NotFoundError('顧客が見つかりません')
  }

  // 売上サマリを取得
  const salesSummary = await customerRepository.getSalesSummary(id, userId)
  
  // 案件数を取得
  const projectCount = await customerRepository.countProjects(id, userId)

  return {
    customer,
    salesSummary,
    projectCount,
  }
}
