"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useExpenses,
  useDeleteExpense,
} from "@/features/expenses/hooks/useExpenses";
import { useExpenseCategories } from "@/features/expense-categories/hooks/useExpenseCategories";
import { useProjects } from "@/features/projects/hooks/useProjects";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/money/formatter";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "銀行振込",
  CREDIT_CARD: "クレジットカード",
  CASH: "現金",
  OTHER: "その他",
};

export default function ExpensesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [projectFilter, setProjectFilter] = useState<string>("");

  const { data, isLoading, error } = useExpenses({
    categoryId: categoryFilter || undefined,
    projectId: projectFilter || undefined,
    limit: 100,
  });
  const { data: categoriesData } = useExpenseCategories();
  const { data: projectsData } = useProjects({ limit: 100 });
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const handleDelete = (expenseId: string) => {
    if (window.confirm("この経費を削除してもよろしいですか？")) {
      deleteExpense(expenseId);
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

  const expenses = data?.expenses || [];
  const categories = categoriesData?.categories || [];
  const projects = projectsData?.projects || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">経費</h1>
        <Link href="/expenses/new">
          <Button>経費登録</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">すべて</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              案件
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">すべて</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {(categoryFilter || projectFilter) && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryFilter("");
                  setProjectFilter("");
                }}
              >
                クリア
              </Button>
            </div>
          )}
        </div>
      </Card>

      {expenses.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">経費がありません</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支払方法
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="info">{expense.category?.name}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.project ? (
                        <Link
                          href={`/projects/${expense.project.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expense.project.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/expenses/${expense.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/expenses/${expense.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-sm font-bold text-gray-900 text-right"
                  >
                    合計
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(
                      expenses.reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
