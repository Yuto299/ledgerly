"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import {
  CreatePaymentDto,
  createPaymentSchema,
} from "../schemas/paymentSchema";

interface PaymentFormProps {
  onSubmit: (data: CreatePaymentDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  defaultValues?: CreatePaymentDto;
}

export function PaymentForm({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePaymentDto>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: defaultValues || {
      amount: 0,
      paidAt: new Date().toISOString().split("T")[0],
      paymentMethod: "BANK_TRANSFER",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="amount" required>
          入金額
        </Label>
        <input
          id="amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="paidAt" required>
          入金日
        </Label>
        <input
          id="paidAt"
          type="date"
          {...register("paidAt")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.paidAt && (
          <p className="text-sm text-red-600">{errors.paidAt.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="paymentMethod" required>
          支払方法
        </Label>
        <select
          id="paymentMethod"
          {...register("paymentMethod")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="BANK_TRANSFER">銀行振込</option>
          <option value="CREDIT_CARD">クレジットカード</option>
          <option value="CASH">現金</option>
          <option value="OTHER">その他</option>
        </select>
        {errors.paymentMethod && (
          <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備考</Label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.notes && (
          <p className="text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登録中..." : "登録"}
        </Button>
      </div>
    </form>
  );
}
