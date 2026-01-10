import {
  InvoiceListResponse,
  InvoiceDetailResponse,
  InvoiceResponse,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "../schemas/invoiceSchema";

const BASE_URL = "/api/invoices";

/**
 * APIクライアント
 */
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.error?.message || error.message || "API Error");
  }

  return response.json();
}

/**
 * 請求書一覧を取得
 */
export async function getInvoices(params?: {
  page?: number;
  limit?: number;
  customerId?: string;
  projectId?: string;
  status?: string;
}): Promise<InvoiceListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.customerId) searchParams.append("customerId", params.customerId);
  if (params?.projectId) searchParams.append("projectId", params.projectId);
  if (params?.status) searchParams.append("status", params.status);

  const url = searchParams.toString()
    ? `${BASE_URL}?${searchParams}`
    : BASE_URL;
  return fetchApi(url);
}

/**
 * 請求書詳細を取得
 */
export async function getInvoice(id: string): Promise<InvoiceDetailResponse> {
  return fetchApi(`${BASE_URL}/${id}`);
}

/**
 * 請求書を作成
 */
export async function createInvoice(
  data: CreateInvoiceDto
): Promise<InvoiceResponse> {
  return fetchApi(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 請求書を更新
 */
export async function updateInvoice(
  id: string,
  data: UpdateInvoiceDto
): Promise<InvoiceResponse> {
  return fetchApi(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 請求書を削除
 */
export async function deleteInvoice(id: string): Promise<{ success: boolean }> {
  return fetchApi(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

/**
 * 請求書を送付済みにする
 */
export async function markInvoiceSent(id: string): Promise<InvoiceResponse> {
  return fetchApi(`${BASE_URL}/${id}/send`, {
    method: "POST",
  });
}
