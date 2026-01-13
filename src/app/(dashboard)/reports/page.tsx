"use client";

import { useState } from "react";
import { format, subMonths } from "date-fns";
import {
  useMonthlySummary,
  useMonthlyTrend,
  useExpenseBreakdown,
  useProjectSales,
} from "@/features/reports/hooks/useReports";
import { formatCurrency } from "@/lib/money/formatter";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
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

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [trendMonths, setTrendMonths] = useState(12);

  const { data: summary, isLoading: summaryLoading } =
    useMonthlySummary(selectedMonth);
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(trendMonths);
  const { data: expenseBreakdown, isLoading: expenseLoading } =
    useExpenseBreakdown(selectedMonth);
  const { data: projectSales, isLoading: projectsLoading } =
    useProjectSales(selectedMonth);

  const isLoading =
    summaryLoading || trendLoading || expenseLoading || projectsLoading;

  // 月の選択肢を生成（過去24ヶ月）
  const monthOptions = Array.from({ length: 24 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, "yyyy-MM");
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">月別レポート</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* サマリカード */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
              売上（入金ベース）
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatCurrency(summary.revenue)}
            </p>
            <p className="text-sm text-gray-500 mt-2">入金された金額</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              請求額（請求ベース）
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.billedAmount)}
            </p>
            <p className="text-sm text-gray-500 mt-2">発行した請求書の合計</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">経費</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.expenses)}
            </p>
            <p className="text-sm text-gray-500 mt-2">発生した経費の合計</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">利益</h3>
            <p
              className={`text-3xl font-bold ${
                summary.profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(summary.profit)}
            </p>
            <p className="text-sm text-gray-500 mt-2">売上 - 経費</p>
          </Card>
        </div>
      )}

      {/* 未回収金額 */}
      {summary && summary.unpaidAmount > 0 && (
        <Card className="mb-8 bg-orange-50 border-orange-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                未回収金額
              </h3>
              <p className="text-sm text-orange-700">
                請求済みで未入金の金額があります
              </p>
            </div>
            <p className="text-4xl font-bold text-orange-600">
              {formatCurrency(summary.unpaidAmount)}
            </p>
          </div>
        </Card>
      )}

      {/* 月別推移グラフ */}
      <Card className="mb-6 md:mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            月別推移
          </h2>
          <select
            value={trendMonths}
            onChange={(e) => setTrendMonths(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value={6}>6ヶ月</option>
            <option value={12}>12ヶ月</option>
            <option value={24}>24ヶ月</option>
          </select>
        </div>
        {trend && trend.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <ResponsiveContainer width="100%" height={380} minWidth={400}>
              <LineChart
                data={trend}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "13px" }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  name="売上"
                  dot={{
                    r: 4,
                    fill: "#60a5fa",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#c084fc"
                  strokeWidth={3}
                  name="経費"
                  dot={{
                    r: 4,
                    fill: "#c084fc",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorExpenses)"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#34d399"
                  strokeWidth={3}
                  name="利益"
                  dot={{
                    r: 4,
                    fill: "#34d399",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorProfit)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            データがありません
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* 経費カテゴリ別内訳 */}
        <Card className="shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            経費カテゴリ別内訳
          </h2>
          {expenseBreakdown && expenseBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                    label={(entry) => {
                      const percent = (
                        (entry.amount /
                          expenseBreakdown.reduce(
                            (sum, e) => sum + e.amount,
                            0
                          )) *
                        100
                      ).toFixed(0);
                      return `${percent}%`;
                    }}
                    labelLine={false}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.categoryColor}
                        opacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenseBreakdown.map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.categoryColor }}
                      />
                      <span className="font-medium">{item.categoryName}</span>
                      <span className="text-sm text-gray-500">
                        ({item.count}件)
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              データがありません
            </div>
          )}
        </Card>

        {/* 案件別売上 */}
        <Card className="shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-6 text-gray-800">
            案件別売上
          </h2>
          {projectSales && projectSales.length > 0 ? (
            <>
              <div className="w-full" style={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectSales.slice(0, 5)}
                    margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
                  >
                    <defs>
                      <linearGradient
                        id="gradientBilled"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#60a5fa"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradientPaid"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#34d399"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#10b981"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="projectName"
                      angle={0}
                      textAnchor="middle"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      style={{ fontWeight: 500 }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `¥${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 13, fill: "#6b7280" }}
                      width={70}
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(dataMax * 1.2),
                      ]}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ fontSize: 14, fontWeight: "bold" }}
                      contentStyle={{
                        fontSize: 13,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ paddingTop: "20px", fontSize: "13px" }}
                      iconType="circle"
                      iconSize={10}
                    />
                    <Bar
                      dataKey="totalBilled"
                      fill="url(#gradientBilled)"
                      name="請求額"
                      radius={[8, 8, 0, 0]}
                      barSize={55}
                    />
                    <Bar
                      dataKey="totalPaid"
                      fill="url(#gradientPaid)"
                      name="入金額"
                      radius={[8, 8, 0, 0]}
                      barSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {projectSales.slice(0, 5).map((item) => (
                  <div
                    key={item.projectId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{item.projectName}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.totalBilled)}
                      </div>
                      {item.unpaidAmount > 0 && (
                        <div className="text-sm text-orange-600">
                          未回収: {formatCurrency(item.unpaidAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              データがありません
            </div>
          )}
        </Card>
      </div>

      {/* エクスポート機能（将来実装） */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold mb-1">レポートのエクスポート</h3>
            <p className="text-sm text-gray-500">
              このレポートをCSV形式でダウンロードできます（将来実装予定）
            </p>
          </div>
          <Button variant="secondary" disabled>
            CSV エクスポート
          </Button>
        </div>
      </Card>
    </div>
  );
}
