import { projectRepository } from "@/infrastructure/repositories/projectRepository";
import {
  UpdateProjectDto,
  updateProjectSchema,
} from "@/features/projects/schemas/projectSchema";
import { NotFoundError } from "@/lib/api/errors";
import { ContractType, ProjectStatus } from "@prisma/client";

/**
 * 案件更新ユースケース
 */
export async function updateProject(
  userId: string,
  projectId: string,
  data: UpdateProjectDto
) {
  // バリデーション
  const validatedData = updateProjectSchema.parse(data);

  // 案件の存在確認
  const existingProject = await projectRepository.findById(projectId, userId);
  if (!existingProject) {
    throw new NotFoundError("案件が見つかりません");
  }

  // 案件更新
  const project = await projectRepository.update(projectId, userId, {
    customerId: validatedData.customerId,
    name: validatedData.name,
    description: validatedData.description,
    contractType: validatedData.contractType as ContractType | undefined,
    contractAmount: validatedData.contractAmount,
    hourlyRate: validatedData.hourlyRate,
    startDate: validatedData.startDate
      ? new Date(validatedData.startDate)
      : undefined,
    endDate: validatedData.endDate
      ? new Date(validatedData.endDate)
      : undefined,
    status: validatedData.status as ProjectStatus | undefined,
  });

  return project;
}
