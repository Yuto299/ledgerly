"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  CreateProjectDto,
} from "../schemas/projectSchema";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { useCustomers } from "@/features/customers/hooks/useCustomers";

interface ProjectFormProps {
  defaultValues?: Partial<CreateProjectDto>;
  onSubmit: (data: CreateProjectDto) => void;
  isSubmitting?: boolean;
}

const CONTRACT_TYPES = [
  { value: "FIXED", label: "固定報酬" },
  { value: "HOURLY", label: "時給" },
  { value: "COMMISSION", label: "成果報酬" },
];

const PROJECT_STATUSES = [
  { value: "PROSPECT", label: "見込み" },
  { value: "IN_PROGRESS", label: "進行中" },
  { value: "COMPLETED", label: "完了" },
  { value: "LOST", label: "失注" },
];

export default function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: ProjectFormProps) {
  const { data: customersData } = useCustomers({ limit: 100 });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  });

  const customers = customersData?.customers || [];

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

      <FormField
        label="案件名"
        required
        error={errors.name?.message}
        {...register("name")}
      />

      <div>
        <label
          htmlFor="contractType"
          className="block text-sm font-medium text-gray-700"
        >
          契約形態 <span className="text-red-500">*</span>
        </label>
        <select
          id="contractType"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("contractType")}
        >
          {CONTRACT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.contractType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contractType.message}
          </p>
        )}
      </div>

      <FormField
        label="契約金額（円）"
        type="number"
        error={errors.contractAmount?.message}
        {...register("contractAmount", {
          setValueAs: (v) => (v === "" || isNaN(v) ? undefined : Number(v)),
        })}
      />

      <FormField
        label="時給（円）"
        type="number"
        error={errors.hourlyRate?.message}
        {...register("hourlyRate", {
          setValueAs: (v) => (v === "" || isNaN(v) ? undefined : Number(v)),
        })}
      />

      <FormField
        label="開始日"
        type="date"
        error={errors.startDate?.message}
        {...register("startDate")}
      />

      <FormField
        label="終了日"
        type="date"
        error={errors.endDate?.message}
        {...register("endDate")}
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
          {PROJECT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
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
