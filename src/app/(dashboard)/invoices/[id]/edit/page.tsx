"use client";

import { use } from "react";
import {
  useInvoice,
  useUpdateInvoice,
} from "@/features/invoices/hooks/useInvoices";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import Card from "@/components/atoms/Card";
import { UpdateInvoiceDto } from "@/features/invoices/schemas/invoiceSchema";

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error: fetchError } = useInvoice(id);
  const { mutate, isPending, error: updateError } = useUpdateInvoice(id);

  const handleSubmit = (formData: UpdateInvoiceDto) => {
    mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">
          エラーが発生しました:{" "}
          {fetchError?.message || "請求書が見つかりません"}
        </p>
      </div>
    );
  }

  const { invoice } = data;
  const items = invoice.items || [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">請求書編集</h1>

      {updateError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {updateError.message}
        </div>
      )}

      <Card>
        <InvoiceForm
          defaultValues={{
            customerId: invoice.customerId,
            projectId: invoice.projectId,
            invoiceNumber: invoice.invoiceNumber || "",
            status: invoice.status,
            issuedAt: new Date(invoice.issuedAt).toISOString().split("T")[0],
            dueAt: new Date(invoice.dueAt).toISOString().split("T")[0],
            notes: invoice.notes || "",
            items: items.map((item) => ({
              description: item.description || "",
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          }}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </Card>
    </div>
  );
}
