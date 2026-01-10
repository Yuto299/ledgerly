"use client";

import Link from "next/link";
import { useState } from "react";
import { useInvoices } from "@/features/invoices/hooks/useInvoices";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/money/formatter";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "下書き",
  SENT: "請求済",
  PAID: "入金済",
};

const STATUS_VARIANTS: Record<
  string,
  "success" | "warning" | "danger" | "info"
> = {
  DRAFT: "info",
  SENT: "warning",
  PAID: "success",
};

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, error } = useInvoices({
    status: statusFilter || undefined,
  });

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

  const invoices = data?.invoices || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">請求書管理</h1>
        <Link href="/invoices/new">
          <Button>+ 新規請求書</Button>
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
          <option value="DRAFT">下書き</option>
          <option value="SENT">請求済</option>
          <option value="PAID">入金済</option>
        </select>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            請求書が登録されていません。新規請求書を追加してください。
          </p>
        </Card>
      ) : (
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支払期限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {invoice.invoiceNumber || `#${invoice.id.slice(0, 8)}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        href={`/customers/${invoice.customer.id}`}
                        className="text-gray-900 hover:text-primary-600"
                      >
                        {invoice.customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/projects/${invoice.project.id}`}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        {invoice.project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.issuedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.dueAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANTS[invoice.status]}>
                        {STATUS_LABELS[invoice.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/invoices/${invoice.id}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        編集
                      </Link>
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
              href={`/invoices?page=${page}`}
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
