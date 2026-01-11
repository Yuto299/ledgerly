import { userSettingsRepository } from "@/infrastructure/repositories/userSettingsRepository";

type SettingsUpdateData = {
  businessName?: string | null;
  representativeName?: string | null;
  postalCode?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  accountType?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
  invoicePrefix?: string | null;
  taxRate?: number | null;
  defaultPaymentDays?: number | null;
  invoiceNotes?: string | null;
};

export async function updateSettings(userId: string, data: SettingsUpdateData) {
  return userSettingsRepository.update(userId, data);
}
