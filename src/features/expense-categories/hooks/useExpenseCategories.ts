import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseCategoryApi } from "../services/expenseCategoryApi";
import {
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
} from "../schemas/expenseCategorySchema";

/**
 * 経費カテゴリ一覧取得フック
 */
export function useExpenseCategories() {
  return useQuery({
    queryKey: ["expense-categories"],
    queryFn: () => expenseCategoryApi.list(),
    staleTime: 1000 * 60 * 5, // 5分
  });
}

/**
 * 経費カテゴリ作成フック
 */
export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseCategoryDto) =>
      expenseCategoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}

/**
 * 経費カテゴリ更新フック
 */
export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateExpenseCategoryDto;
    }) => expenseCategoryApi.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}

/**
 * 経費カテゴリ削除フック
 */
export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => expenseCategoryApi.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}
