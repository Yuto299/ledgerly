import { prisma } from "../db/prisma";
import { Prisma, ProjectStatus, ContractType } from "@prisma/client";

/**
 * 案件リポジトリ
 */
export class ProjectRepository {
  /**
   * 案件一覧を取得
   */
  async findAll(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      customerId?: string;
      status?: ProjectStatus;
    } = {}
  ) {
    const { page = 1, limit = 10, customerId, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      userId,
      deletedAt: null,
    };

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * IDで案件を取得
   */
  async findById(id: string, userId: string) {
    return prisma.project.findFirst({
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
          },
        },
      },
    });
  }

  /**
   * 案件を作成
   */
  async create(data: {
    userId: string;
    customerId: string;
    name: string;
    description?: string;
    contractType: ContractType;
    contractAmount?: number;
    hourlyRate?: number;
    startDate?: Date;
    endDate?: Date;
    status?: ProjectStatus;
  }) {
    return prisma.project.create({
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * 案件を更新
   */
  async update(
    id: string,
    userId: string,
    data: {
      customerId?: string;
      name?: string;
      description?: string;
      contractType?: ContractType;
      contractAmount?: number;
      hourlyRate?: number;
      startDate?: Date;
      endDate?: Date;
      status?: ProjectStatus;
    }
  ) {
    return prisma.project.update({
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
      },
    });
  }

  /**
   * 案件を削除（論理削除）
   */
  async delete(id: string, userId: string) {
    return prisma.project.update({
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
   * 案件に紐づく請求書の数を取得
   */
  async countInvoices(projectId: string, userId: string): Promise<number> {
    return prisma.invoice.count({
      where: {
        projectId,
        userId,
        deletedAt: null,
      },
    });
  }

  /**
   * 案件の請求書サマリーを取得
   */
  async getInvoicesSummary(projectId: string, userId: string) {
    const invoices = await prisma.invoice.findMany({
      where: {
        projectId,
        userId,
        deletedAt: null,
      },
      select: {
        totalAmount: true,
        status: true,
      },
    });

    const totalInvoiced = invoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
    const totalPaid = invoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    return {
      totalInvoiced,
      totalPaid,
      unpaid: totalInvoiced - totalPaid,
    };
  }
}

export const projectRepository = new ProjectRepository();
