"use client";

import { use } from "react";
import Link from "next/link";
import {
  useExpense,
  useDeleteExpense,
} from "@/features/expenses/hooks/useExpenses";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/money/formatter";
import { useRouter } from "next/navigation";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "銀行振込",
  CREDIT_CARD: "クレジットカード",
  CASH: "現金",
  OTHER: "その他",
};

export default function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useExpense(id);
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const handleDelete = () => {
    if (window.confirm("この経費を削除してもよろしいですか？")) {
      deleteExpense(id, {
        onSuccess: () => {
          router.push("/expenses");
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

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">
          エラーが発生しました: {error?.message || "経費が見つかりません"}
        </p>
      </div>
    );
  }

  const { expense } = data;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">経費詳細</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/expenses/${id}/edit`}>
            <Button variant="outline">編集</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">日付</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(expense.date)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">金額</dt>
              <dd className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(expense.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">カテゴリ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Badge variant="info">{expense.category?.name}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">支払方法</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">案件</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {expense.project ? (
                  <Link
                    href={`/projects/${expense.project.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expense.project.name}
                  </Link>
                ) : (
                  "なし"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">説明</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {expense.description || "-"}
              </dd>
            </div>
          </dl>
        </Card>

        {expense.notes && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">備考</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {expense.notes}
            </p>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-semibold mb-4">システム情報</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">登録日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(expense.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">更新日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(expense.updatedAt)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
