"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  createInvoiceSchema,
  CreateInvoiceDto,
} from "../schemas/invoiceSchema";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { formatCurrency } from "@/lib/money/formatter";

interface InvoiceFormProps {
  defaultValues?: Partial<CreateInvoiceDto>;
  onSubmit: (data: CreateInvoiceDto) => void;
  isSubmitting?: boolean;
}

export default function InvoiceForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: InvoiceFormProps) {
  const { data: customersData } = useCustomers({ limit: 100 });
  const { data: projectsData } = useProjects({ limit: 100 });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInvoiceDto>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: defaultValues || {
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const customers = customersData?.customers || [];
  const projects = projectsData?.projects || [];
  const watchedItems = watch("items");
  const watchedProjectId = watch("projectId");
  const watchedCustomerId = watch("customerId");

  // 選択された顧客の案件のみフィルタリング
  const filteredProjects = watchedCustomerId
    ? projects.filter((p) => p.customerId === watchedCustomerId)
    : [];

  // 顧客変更時に案件選択をクリア（新規作成時のみ）
  useEffect(() => {
    // 編集モードの場合はクリアしない
    if (defaultValues?.customerId) return;
    setValue("projectId", "");
  }, [watchedCustomerId, setValue, defaultValues]);

  // 案件選択時に明細を自動生成（新規作成時のみ）
  useEffect(() => {
    // 編集モードの場合は自動生成しない
    if (defaultValues?.projectId) return;

    if (watchedProjectId && projects.length > 0) {
      const selectedProject = projects.find((p) => p.id === watchedProjectId);
      if (selectedProject) {
        // 時給契約の場合
        if (
          selectedProject.contractType === "HOURLY" &&
          selectedProject.hourlyRate
        ) {
          replace([
            {
              description: selectedProject.name,
              quantity: 1,
              unitPrice: selectedProject.hourlyRate,
            },
          ]);
        }
        // 固定報酬または成果報酬の場合
        else if (selectedProject.contractAmount) {
          replace([
            {
              description: selectedProject.name,
              quantity: 1,
              unitPrice: selectedProject.contractAmount,
            },
          ]);
        }
        // 金額未設定の場合は案件名だけセット
        else {
          replace([
            {
              description: selectedProject.name,
              quantity: 1,
              unitPrice: 0,
            },
          ]);
        }
      }
    }
  }, [watchedProjectId, projects, replace]);

  // 合計金額を計算（時給 × 時間 または 数量 × 単価）
  const totalAmount =
    watchedItems?.reduce((sum, item) => {
      if (item.hours && item.hours > 0) {
        // 時給契約の場合：時給 × 時間
        return sum + item.hours * (item.unitPrice || 0);
      }
      // 通常：数量 × 単価
      return sum + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0) || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="customerId"
          className="block text-sm font-medium text-gray-700"
        >
          顧客 <span className="text-red-500">*</span>
        </label>
        <select
          id="customerId"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("customerId")}
        >
          <option value="">顧客を選択してください</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customerId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.customerId.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700"
        >
          案件 <span className="text-red-500">*</span>
        </label>
        <select
          id="projectId"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("projectId")}
          disabled={!watchedCustomerId}
        >
          <option value="">
            {watchedCustomerId
              ? "案件を選択してください"
              : "先に顧客を選択してください"}
          </option>
          {filteredProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.projectId.message}
          </p>
        )}
      </div>

      <FormField
        label="請求書番号（自動採番）"
        placeholder="未入力の場合は自動生成されます"
        error={errors.invoiceNumber?.message}
        {...register("invoiceNumber")}
      />

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          ステータス
        </label>
        <select
          id="status"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("status")}
        >
          <option value="DRAFT">下書き</option>
          <option value="SENT">請求済</option>
          <option value="PAID">入金済</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="請求日"
          type="date"
          required
          error={errors.issuedAt?.message}
          {...register("issuedAt")}
        />

        <FormField
          label="支払期限"
          type="date"
          required
          error={errors.dueAt?.message}
          {...register("dueAt")}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            明細 <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ description: "", quantity: 1, unitPrice: 0 })
            }
          >
            + 明細追加
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-md"
            >
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="品目・説明"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register(`items.${index}.description`)}
                  />
                  {errors.items?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  削除
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="数量"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="単価（円）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register(`items.${index}.unitPrice`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.unitPrice?.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="稼働時間（時間・オプション）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register(`items.${index}.hours`, {
                      setValueAs: (v) =>
                        v === "" || isNaN(v) ? undefined : Number(v),
                    })}
                  />
                  {errors.items?.[index]?.hours && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.hours?.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(
                      watchedItems?.[index]?.hours &&
                        watchedItems[index].hours! > 0
                        ? watchedItems[index].hours! *
                            (watchedItems[index]?.unitPrice || 0)
                        : (watchedItems?.[index]?.quantity || 0) *
                            (watchedItems?.[index]?.unitPrice || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.items && !Array.isArray(errors.items) && (
          <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">合計金額</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          メモ
        </label>
        <textarea
          id="notes"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
