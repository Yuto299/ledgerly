import { customerRepository } from '@/infrastructure/repositories/customerRepository'
import { NotFoundError, ConflictError } from '@/lib/api/errors'

/**
 * 顧客削除ユースケース（論理削除）
 */
export async function deleteCustomer(id: string, userId: string) {
  // 存在確認
  const existing = await customerRepository.findById(id, userId)
  if (!existing) {
    throw new NotFoundError('顧客が見つかりません')
  }

  // 紐づく案件が存在するか確認
  const projectCount = await customerRepository.countProjects(id, userId)
  if (projectCount > 0) {
    throw new ConflictError(
      `この顧客には${projectCount}件の案件が紐づいているため削除できません`
    )
  }

  return await customerRepository.delete(id, userId)
}
