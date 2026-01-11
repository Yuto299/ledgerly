import { prisma } from "@/infrastructure/db/prisma";

type UserSettings = {
  id: string;
  userId: string;
  businessName: string | null;
  representativeName: string | null;
  postalCode: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  bankName: string | null;
  branchName: string | null;
  accountType: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  invoicePrefix: string | null;
  taxRate: number | null;
  defaultPaymentDays: number | null;
  invoiceNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserSettingsUpdateData = Partial<
  Omit<UserSettings, "id" | "userId" | "createdAt" | "updatedAt">
>;

export const userSettingsRepository = {
  /**
   * ユーザーの設定を取得（存在しない場合は作成）
   */
  async findOrCreateByUserId(userId: string): Promise<UserSettings> {
    let settings = await (prisma as any).userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await (prisma as any).userSettings.create({
        data: {
          userId,
        },
      });
    }

    return settings;
  },

  /**
   * ユーザーの設定を更新
   */
  async update(
    userId: string,
    data: UserSettingsUpdateData
  ): Promise<UserSettings> {
    // 設定が存在しない場合は作成
    await this.findOrCreateByUserId(userId);

    return (prisma as any).userSettings.update({
      where: { userId },
      data,
    });
  },

  /**
   * ユーザーの設定を削除
   */
  async delete(userId: string): Promise<void> {
    await (prisma as any).userSettings.delete({
      where: { userId },
    });
  },
};
