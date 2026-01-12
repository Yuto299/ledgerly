"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  useExpense,
  useUpdateExpense,
} from "@/features/expenses/hooks/useExpenses";
import { useExpenseCategories } from "@/features/expense-categories/hooks/useExpenseCategories";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import {
  UpdateExpenseDto,
  updateExpenseSchema,
} from "@/features/expenses/schemas/expenseSchema";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useExpense(id);
  const { mutate: updateExpense, isPending } = useUpdateExpense();
  const { data: categoriesData } = useExpenseCategories();
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: customersData } = useCustomers({ limit: 100 });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const categories = categoriesData?.categories || [];
  const projects = projectsData?.projects || [];
  const customers = customersData?.customers || [];

  // 既存の案件から顧客IDを取得して初期値として設定
  useEffect(() => {
    if (data?.expense?.project?.customerId) {
      setSelectedCustomerId(data.expense.project.customerId);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateExpenseDto>({
    resolver: zodResolver(updateExpenseSchema),
    values: data?.expense
      ? {
          date: new Date(data.expense.date).toISOString().split("T")[0],
          amount: data.expense.amount,
          categoryId: data.expense.categoryId,
          projectId: data.expense.projectId || "",
          paymentMethod: data.expense.paymentMethod as
            | "BANK_TRANSFER"
            | "CREDIT_CARD"
            | "CASH"
            | "OTHER",
          description: data.expense.description || "",
          notes: data.expense.notes || "",
        }
      : undefined,
  });

  // 既存のprojectIdがプロジェクトリストに存在するか確認
  useEffect(() => {
    if (data?.expense?.projectId && projects.length > 0) {
      const projectExists = projects.some(
        (p) => p.id === data.expense.projectId
      );
      if (!projectExists) {
        // プロジェクトが存在しない場合は空文字列に設定
        setValue("projectId", "");
        setSelectedCustomerId("");
      }
    }
  }, [data, projects, setValue]);

  const onSubmit = (updateData: UpdateExpenseDto) => {
    console.log("Form submitted:", updateData);
    const submitData = {
      ...updateData,
      projectId:
        updateData.projectId && updateData.projectId !== ""
          ? updateData.projectId
          : undefined,
    };
    console.log("Sending to API:", submitData);

    updateExpense(
      {
        expenseId: id,
        data: submitData,
      },
      {
        onSuccess: () => {
          console.log("Update successful");
          router.push("/expenses");
          router.refresh();
        },
        onError: (error) => {
          console.error("Update failed:", error);
          alert(`更新に失敗しました: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">経費が見つかりません</p>
      </div>
    );
  }

  // 選択された顧客の案件のみフィルタリング
  const filteredProjects = selectedCustomerId
    ? projects.filter((p) => p.customerId === selectedCustomerId)
    : projects;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">経費編集</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="date" required>
              日付
            </Label>
            <input
              id="date"
              type="date"
              {...register("date")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="categoryId" required>
              カテゴリ
            </Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount" required>
              金額
            </Label>
            <input
              id="amount"
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="paymentMethod" required>
              支払方法
            </Label>
            <select
              id="paymentMethod"
              {...register("paymentMethod")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="CASH">現金</option>
              <option value="BANK_TRANSFER">銀行振込</option>
              <option value="CREDIT_CARD">クレジットカード</option>
              <option value="OTHER">その他</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-600">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="customerId">顧客（任意）</Label>
            <select
              id="customerId"
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                // 顧客変更時に案件をクリア
                if (e.target.value !== data?.expense?.project?.customerId) {
                  setValue("projectId", "");
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">なし</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="projectId">案件（任意）</Label>
            <select
              id="projectId"
              {...register("projectId")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">
                {selectedCustomerId
                  ? "なし"
                  : "顧客を選択すると案件を絞り込みます"}
              </option>
              {filteredProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">説明</Label>
            <input
              id="description"
              type="text"
              {...register("description")}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="例: 交通費、会議費用など"
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">備考</Label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/expenses")}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
