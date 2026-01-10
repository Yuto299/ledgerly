"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useDashboardData } from "@/features/reports/hooks/useReports";
import { formatCurrency } from "@/lib/money/formatter";
import { formatDate } from "@/lib/utils";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "下書き",
  SENT: "請求済",
  PAID: "入金済",
};

const INVOICE_STATUS_COLORS: Record<
  string,
  "default" | "info" | "danger" | "success" | "warning"
> = {
  DRAFT: "default",
  SENT: "warning",
  PAID: "success",
};

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const { data, isLoading } = useDashboardData(selectedMonth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">データがありません</div>
      </div>
    );
  }

  const {
    summary,
    trend,
    expenseBreakdown,
    projectSales,
    recentInvoices,
    recentExpenses,
  } = data;

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">ダッシュボード</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
        />
      </div>

      {/* サマリカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
            今月の売上
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {formatCurrency(summary.revenue)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            請求額: {formatCurrency(summary.billedAmount)}
          </p>
        </Card>

        <Card>
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
            今月の経費
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {formatCurrency(summary.expenses)}
          </p>
        </Card>

        <Card>
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
            今月の利益
          </h3>
          <p
            className={`text-2xl sm:text-3xl font-bold ${
              summary.profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.profit)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">売上 - 経費</p>
        </Card>

        <Card>
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
            未回収金額
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {formatCurrency(summary.unpaidAmount)}
          </p>
          <p className="text-sm text-gray-500 mt-2">請求済み未入金</p>
        </Card>
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* 月別推移グラフ */}
        <Card>
          <h2 className="text-base sm:text-lg font-semibold mb-4">月別推移</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={trend}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                name="売上"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                name="経費"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                name="利益"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 経費カテゴリ別円グラフ */}
        <Card>
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            経費カテゴリ別内訳
          </h2>
          {expenseBreakdown.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={250}
              className="md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => {
                    const percent = (
                      (entry.amount /
                        expenseBreakdown.reduce(
                          (sum, e) => sum + e.amount,
                          0
                        )) *
                      100
                    ).toFixed(0);
                    return `${entry.categoryName} (${percent}%)`;
                  }}
                  labelLine={true}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.categoryColor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              データがありません
            </div>
          )}
        </Card>
      </div>

      {/* 案件別売上ランキング */}
      <Card className="mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          案件別売上ランキング
        </h2>
        {projectSales.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <ResponsiveContainer width="100%" height={350} minWidth={500}>
              <BarChart
                data={projectSales.slice(0, 10)}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="projectName"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ fontSize: 14, fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar
                  dataKey="totalBilled"
                  fill="#3b82f6"
                  name="請求額"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="totalPaid"
                  fill="#10b981"
                  name="入金額"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            データがありません
          </div>
        )}
      </Card>

      {/* 最近のアクティビティ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 最近の請求書 */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-semibold">最近の請求書</h2>
            <Link href="/invoices">
              <Button variant="ghost" size="sm">
                すべて表示
              </Button>
            </Link>
          </div>
          {recentInvoices.length > 0 ? (
            <div className="space-y-3">
              {recentInvoices.map(
                (invoice: {
                  id: string;
                  customer: { name: string };
                  project: { name: string };
                  issuedAt: Date;
                  totalAmount: number;
                  status: string;
                }) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{invoice.customer.name}</p>
                        <p className="text-sm text-gray-500">
                          {invoice.project.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(invoice.issuedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(invoice.totalAmount)}
                        </p>
                        <Badge variant={INVOICE_STATUS_COLORS[invoice.status]}>
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">データがありません</p>
          )}
        </Card>

        {/* 最近の経費 */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-semibold">最近の経費</h2>
            <Link href="/expenses">
              <Button variant="ghost" size="sm">
                すべて表示
              </Button>
            </Link>
          </div>
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map(
                (expense: {
                  id: string;
                  description: string;
                  date: Date;
                  amount: number;
                  category: { name: string; color: string } | null;
                }) => (
                  <Link
                    key={expense.id}
                    href={`/expenses/${expense.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {expense.category && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: expense.category.color,
                              }}
                            />
                          )}
                          <p className="font-medium">{expense.description}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {expense.category?.name || "未分類"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(expense.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">データがありません</p>
          )}
        </Card>
      </div>
    </div>
  );
}
