import { prisma } from "../db/prisma";
import { PaymentMethod, Prisma } from "@prisma/client";

/**
 * 経費リポジトリ
 */
export const expenseRepository = {
  /**
   * 経費一覧を取得（フィルタ・ページネーション対応）
   */
  async findMany(
    userId: string,
    options: {
      projectId?: string;
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const {
      projectId,
      categoryId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = options;

    const where: Prisma.ExpenseWhereInput = {
      userId,
      deletedAt: null,
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return { expenses, total };
  },

  /**
   * IDで経費を取得
   */
  async findById(id: string, userId: string) {
    return prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  /**
   * 経費を作成
   */
  async create(data: {
    userId: string;
    projectId?: string;
    categoryId: string;
    date: Date;
    amount: number;
    paymentMethod: PaymentMethod;
    description?: string;
    notes?: string;
  }) {
    return prisma.expense.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        categoryId: data.categoryId,
        date: data.date,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        description: data.description,
        notes: data.notes,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  /**
   * 経費を更新
   */
  async update(
    id: string,
    userId: string,
    data: {
      projectId?: string | null;
      categoryId?: string;
      date?: Date;
      amount?: number;
      paymentMethod?: PaymentMethod;
      description?: string;
      notes?: string;
    }
  ) {
    return prisma.expense.update({
      where: {
        id,
        userId,
      },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  /**
   * 経費を削除（論理削除）
   */
  async delete(id: string, userId: string) {
    return prisma.expense.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  /**
   * 期間内の経費合計を取得
   */
  async getTotalAmount(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    projectId?: string
  ): Promise<number> {
    const where: Prisma.ExpenseWhereInput = {
      userId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const result = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  },
};
