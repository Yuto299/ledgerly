import { useQuery } from "@tanstack/react-query";

export interface MonthlySummary {
  month: string;
  revenue: number;
  billedAmount: number;
  expenses: number;
  profit: number;
  unpaidAmount: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  count: number;
}

export interface ProjectSales {
  projectId: string;
  projectName: string;
  totalBilled: number;
  totalPaid: number;
  unpaidAmount: number;
}

export interface DashboardData {
  summary: MonthlySummary;
  trend: MonthlyTrend[];
  expenseBreakdown: ExpenseBreakdown[];
  projectSales: ProjectSales[];
  recentInvoices: Array<{
    id: string;
    customer: { name: string };
    project: { name: string };
    issuedAt: Date;
    totalAmount: number;
    status: string;
  }>;
  recentExpenses: Array<{
    id: string;
    description: string;
    date: Date;
    amount: number;
    category: { name: string; color: string } | null;
  }>;
}

export function useDashboardData(month: string) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", month],
    queryFn: async () => {
      const res = await fetch(`/api/reports/dashboard?month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
  });
}

export function useMonthlySummary(month: string) {
  return useQuery<MonthlySummary>({
    queryKey: ["reports", "monthly", month],
    queryFn: async () => {
      const res = await fetch(`/api/reports/monthly?month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch monthly summary");
      return res.json();
    },
  });
}

export function useMonthlyTrend(months: number = 6) {
  return useQuery<MonthlyTrend[]>({
    queryKey: ["reports", "trend", months],
    queryFn: async () => {
      const res = await fetch(`/api/reports/trend?months=${months}`);
      if (!res.ok) throw new Error("Failed to fetch monthly trend");
      return res.json();
    },
  });
}

export function useExpenseBreakdown(month?: string) {
  return useQuery<ExpenseBreakdown[]>({
    queryKey: ["reports", "expenses", month],
    queryFn: async () => {
      const url = month
        ? `/api/reports/expenses?month=${month}`
        : "/api/reports/expenses";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch expense breakdown");
      return res.json();
    },
  });
}

export function useProjectSales(month?: string) {
  return useQuery<ProjectSales[]>({
    queryKey: ["reports", "projects", month],
    queryFn: async () => {
      const url = month
        ? `/api/reports/projects?month=${month}`
        : "/api/reports/projects";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch project sales");
      return res.json();
    },
  });
}
