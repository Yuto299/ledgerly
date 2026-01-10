"use client";

import { useRouter } from "next/navigation";
import { useCreateInvoice } from "@/features/invoices/hooks/useInvoices";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import Card from "@/components/atoms/Card";
import { CreateInvoiceDto } from "@/features/invoices/schemas/invoiceSchema";

export default function NewInvoicePage() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateInvoice();

  const handleSubmit = (data: CreateInvoiceDto) => {
    mutate(data);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">新規請求書作成</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error.message}
        </div>
      )}

      <Card>
        <InvoiceForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </Card>
    </div>
  );
}
