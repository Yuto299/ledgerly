import { prisma } from "../db/prisma";
import { Prisma, InvoiceStatus } from "@prisma/client";

/**
 * 請求書リポジトリ
 */
export class InvoiceRepository {
  /**
   * 請求書一覧を取得
   */
  async findAll(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      customerId?: string;
      projectId?: string;
      status?: InvoiceStatus;
    } = {}
  ) {
    const { page = 1, limit = 10, customerId, projectId, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      userId,
      deletedAt: null,
    };

    if (customerId) {
      where.customerId = customerId;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          items: true,
        },
        orderBy: {
          issuedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * IDで請求書を取得
   */
  async findById(id: string, userId: string) {
    return prisma.invoice.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            contactName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });
  }

  /**
   * 請求書を作成（明細含む）
   */
  async create(data: {
    userId: string;
    customerId: string;
    projectId: string;
    invoiceNumber?: string;
    status?: InvoiceStatus;
    issuedAt: Date;
    dueAt: Date;
    totalAmount: number;
    notes?: string;
    items: Array<{
      name: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      amount: number;
      hours?: number;
      sortOrder: number;
    }>;
  }) {
    const { items, ...invoiceData } = data;

    return prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: items,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        items: true,
      },
    });
  }

  /**
   * 請求書を更新
   */
  async update(
    id: string,
    userId: string,
    data: {
      customerId?: string;
      projectId?: string;
      invoiceNumber?: string;
      status?: InvoiceStatus;
      issuedAt?: Date;
      dueAt?: Date;
      totalAmount?: number;
      notes?: string;
    }
  ) {
    return prisma.invoice.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        items: true,
      },
    });
  }

  /**
   * 請求書を削除（論理削除）
   */
  async delete(id: string, userId: string) {
    return prisma.invoice.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 請求書のステータスを更新
   */
  async updateStatus(id: string, userId: string, status: InvoiceStatus) {
    return prisma.invoice.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        status,
      },
    });
  }

  /**
   * 請求書の入金済み金額を更新
   */
  async updatePaidAmount(id: string, userId: string, paidAmount: number) {
    const invoice = await this.findById(id, userId);
    if (!invoice) return null;

    let status = invoice.status;
    if (paidAmount >= invoice.totalAmount) {
      status = "PAID";
    } else if (paidAmount > 0 && status === "DRAFT") {
      status = "SENT";
    }

    return prisma.invoice.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        paidAmount,
        status,
      },
    });
  }

  /**
   * 請求書明細を全て削除
   */
  async deleteAllItems(invoiceId: string) {
    return prisma.invoiceItem.deleteMany({
      where: {
        invoiceId,
      },
    });
  }
}

export const invoiceRepository = new InvoiceRepository();
