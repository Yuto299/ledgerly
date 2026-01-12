"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useProjects,
  useDeleteProject,
} from "@/features/projects/hooks/useProjects";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/money/formatter";
import { useToast } from "@/components/providers/ToastProvider";

const STATUS_LABELS: Record<string, string> = {
  PROSPECT: "見込み",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  LOST: "失注",
};

const STATUS_VARIANTS: Record<
  string,
  "success" | "warning" | "danger" | "info"
> = {
  PROSPECT: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  LOST: "danger",
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  FIXED: "固定報酬",
  HOURLY: "時給",
  COMMISSION: "成果報酬",
};

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, error } = useProjects({
    status: statusFilter || undefined,
  });
  const { mutate: deleteProject } = useDeleteProject();
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (projectId: string, projectName: string) => {
    if (
      window.confirm(
        `案件「${projectName}」を削除しますか？\n関連する請求書や経費も影響を受ける可能性があります。`
      )
    ) {
      setDeletingId(projectId);
      deleteProject(projectId, {
        onSuccess: () => {
          addToast("案件を削除しました", "success");
          setDeletingId(null);
        },
        onError: (error) => {
          addToast(`削除に失敗しました: ${error.message}`, "error");
          setDeletingId(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">案件管理</h1>
        <Link href="/projects/new">
          <Button className="w-full sm:w-auto">+ 新規案件</Button>
        </Link>
      </div>

      <div className="mb-4">
        <label
          htmlFor="statusFilter"
          className="mr-2 text-sm font-medium text-gray-700"
        >
          ステータス:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">すべて</option>
          <option value="PROSPECT">見込み</option>
          <option value="IN_PROGRESS">進行中</option>
          <option value="COMPLETED">完了</option>
          <option value="LOST">失注</option>
        </select>
      </div>

      {projects.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            案件が登録されていません。新規案件を追加してください。
          </p>
        </Card>
      ) : (
        <Card padding="sm">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    契約形態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    契約金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    開始日
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        href={`/customers/${project.customer.id}`}
                        className="text-gray-900 hover:text-primary-600"
                      >
                        {project.customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {CONTRACT_TYPE_LABELS[project.contractType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.contractType === "HOURLY" && project.hourlyRate
                        ? `${formatCurrency(project.hourlyRate)}/時間`
                        : project.contractAmount
                        ? formatCurrency(project.contractAmount)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANTS[project.status]}>
                        {STATUS_LABELS[project.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.startDate ? formatDate(project.startDate) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        disabled={deletingId === project.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === project.id ? "削除中..." : "削除"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from(
            { length: data.pagination.totalPages },
            (_, i) => i + 1
          ).map((page) => (
            <Link
              key={page}
              href={`/projects?page=${page}`}
              className={`px-4 py-2 rounded ${
                page === data.pagination.page
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
