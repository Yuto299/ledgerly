import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseApi } from "../services/expenseApi";
import { CreateExpenseDto, UpdateExpenseDto } from "../schemas/expenseSchema";

/**
 * 経費一覧取得フック
 */
export function useExpenses(params?: {
  projectId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => expenseApi.list(params),
    staleTime: 1000 * 60,
  });
}

/**
 * 経費詳細取得フック
 */
export function useExpense(expenseId: string) {
  return useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => expenseApi.getById(expenseId),
    staleTime: 1000 * 60,
  });
}

/**
 * 経費作成フック
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

/**
 * 経費更新フック
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: string;
      data: UpdateExpenseDto;
    }) => expenseApi.update(expenseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.expenseId],
      });
    },
  });
}

/**
 * 経費削除フック
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expenseApi.delete(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
