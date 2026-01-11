import { userSettingsRepository } from "@/infrastructure/repositories/userSettingsRepository";

export async function getSettings(userId: string) {
  return userSettingsRepository.findOrCreateByUserId(userId);
}
