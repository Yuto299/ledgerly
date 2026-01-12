import { projectRepository } from "@/infrastructure/repositories/projectRepository";
import {
  CreateProjectDto,
  createProjectSchema,
} from "@/features/projects/schemas/projectSchema";
import { ValidationError } from "@/lib/api/errors";
import { ContractType, ProjectStatus } from "@prisma/client";

/**
 * 案件作成ユースケース
 */
export async function createProject(userId: string, data: CreateProjectDto) {
  // バリデーション
  const validatedData = createProjectSchema.parse(data);

  // 案件作成
  const project = await projectRepository.create({
    userId,
    customerId: validatedData.customerId,
    name: validatedData.name,
    description: validatedData.description,
    contractType: validatedData.contractType as ContractType,
    contractAmount: validatedData.contractAmount,
    hourlyRate: validatedData.hourlyRate,
    startDate: validatedData.startDate
      ? new Date(validatedData.startDate)
      : undefined,
    endDate: validatedData.endDate
      ? new Date(validatedData.endDate)
      : undefined,
    status: validatedData.status as ProjectStatus,
  });

  return project;
}
