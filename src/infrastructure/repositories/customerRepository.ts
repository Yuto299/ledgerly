import { prisma } from '@/infrastructure/db/prisma'
import { Customer } from '@prisma/client'
import { CreateCustomerDto, UpdateCustomerDto } from '@/features/customers/schemas/customerSchema'

/**
 * 顧客リポジトリ
 * データベース操作を抽象化
 */
export class CustomerRepository {
  /**
   * 顧客一覧取得（ページネーション対応）
   */
  async findAll(userId: string, options?: { skip?: number; take?: number }) {
    const { skip = 0, take = 50 } = options || {}

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.customer.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ])

    return { customers, total }
  }

  /**
   * ID指定で顧客取得
   */
  async findById(id: string, userId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    })
  }

  /**
   * 顧客作成
   */
  async create(userId: string, data: CreateCustomerDto): Promise<Customer> {
    return prisma.customer.create({
      data: {
        userId,
        name: data.name,
        contactName: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      },
    })
  }

  /**
   * 顧客更新
   */
  async update(id: string, userId: string, data: UpdateCustomerDto): Promise<Customer> {
    return prisma.customer.update({
      where: {
        id,
        userId,
      },
      data: {
        name: data.name,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * 顧客削除（論理削除）
   */
  async delete(id: string, userId: string): Promise<Customer> {
    return prisma.customer.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  /**
   * 顧客に紐づく案件数を取得
   */
  async countProjects(customerId: string, userId: string): Promise<number> {
    return prisma.project.count({
      where: {
        customerId,
        userId,
        deletedAt: null,
      },
    })
  }

  /**
   * 顧客の売上サマリを取得
   */
  async getSalesSummary(customerId: string, userId: string) {
    const invoices = await prisma.invoice.findMany({
      where: {
        customerId,
        userId,
        deletedAt: null,
      },
      select: {
        totalAmount: true,
        paidAmount: true,
        status: true,
      },
    })

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
    const unpaid = totalInvoiced - totalPaid

    return {
      totalInvoiced,
      totalPaid,
      unpaid,
    }
  }
}

export const customerRepository = new CustomerRepository()
