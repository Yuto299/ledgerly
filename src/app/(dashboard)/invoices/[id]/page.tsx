"use client";

import { use } from "react";
import Link from "next/link";
import {
  useInvoice,
  useDeleteInvoice,
  useMarkInvoiceSent,
} from "@/features/invoices/hooks/useInvoices";
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

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useInvoice(id);
  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice();
  const { mutate: markSent, isPending: isSending } = useMarkInvoiceSent();

  const handleDelete = () => {
    if (window.confirm("この請求書を削除してもよろしいですか？")) {
      deleteInvoice(id);
    }
  };

  const handleMarkSent = () => {
    if (window.confirm("この請求書を送付済みにしますか？")) {
      markSent(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">
          エラーが発生しました: {error?.message || "請求書が見つかりません"}
        </p>
      </div>
    );
  }

  const { invoice } = data;
  const items = invoice.items || [];
  const payments = invoice.payments || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            請求書 {invoice.invoiceNumber || `#${invoice.id.slice(0, 8)}`}
          </h1>
          <div className="mt-2">
            <Badge variant={STATUS_VARIANTS[invoice.status]}>
              {STATUS_LABELS[invoice.status]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === "DRAFT" && (
            <Button
              variant="outline"
              onClick={handleMarkSent}
              disabled={isSending}
            >
              {isSending ? "送付中..." : "送付済みにする"}
            </Button>
          )}
          <Link href={`/invoices/${id}/edit`}>
            <Button variant="outline">編集</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">請求額</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(invoice.totalAmount)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">入金済み</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(invoice.paidAmount)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">未回収</h3>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">顧客</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  href={`/customers/${invoice.customer.id}`}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {invoice.customer.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">案件</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  href={`/projects/${invoice.project.id}`}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {invoice.project.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">請求日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(invoice.issuedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">支払期限</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(invoice.dueAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">登録日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(invoice.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">メモ</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {invoice.notes || "メモはありません"}
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">明細</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  品目
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  単価
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-sm font-bold text-gray-900 text-right"
                >
                  合計
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                  {formatCurrency(invoice.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">入金履歴</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">入金履歴がありません</p>
        ) : (
          <div className="space-y-2">
            {payments.map((payment: any) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(payment.paidAt)}
                  </p>
                  <p className="text-xs text-gray-500">{payment.notes}</p>
                </div>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
