import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceSent,
} from "../services/invoiceApi";
import { CreateInvoiceDto, UpdateInvoiceDto } from "../schemas/invoiceSchema";

/**
 * 請求書一覧取得フック
 */
export function useInvoices(params?: {
  page?: number;
  limit?: number;
  customerId?: string;
  projectId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => getInvoices(params),
  });
}

/**
 * 請求書詳細取得フック
 */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
}

/**
 * 請求書作成フック
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateInvoiceDto) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push("/invoices");
    },
  });
}

/**
 * 請求書更新フック
 */
export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateInvoiceDto) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", id] });
      router.push(`/invoices/${id}`);
    },
  });
}

/**
 * 請求書削除フック
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push("/invoices");
    },
  });
}

/**
 * 請求書送付フック
 */
export function useMarkInvoiceSent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markInvoiceSent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", id] });
    },
  });
}
