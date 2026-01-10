import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseListResponse,
} from "../schemas/expenseSchema";

const API_BASE_URL = "/api";

/**
 * 経費API Client
 */
export const expenseApi = {
  /**
   * 経費一覧取得
   */
  async list(params?: {
    projectId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ExpenseListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.projectId) searchParams.append("projectId", params.projectId);
    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const url = `${API_BASE_URL}/expenses${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("経費一覧の取得に失敗しました");
    }
    return response.json();
  },

  /**
   * 経費詳細取得
   */
  async getById(expenseId: string): Promise<{ expense: any }> {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`);
    if (!response.ok) {
      throw new Error("経費の取得に失敗しました");
    }
    return response.json();
  },

  /**
   * 経費作成
   */
  async create(data: CreateExpenseDto): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("経費の作成に失敗しました");
    }
    return response.json();
  },

  /**
   * 経費更新
   */
  async update(expenseId: string, data: UpdateExpenseDto): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("経費の更新に失敗しました");
    }
    return response.json();
  },

  /**
   * 経費削除
   */
  async delete(expenseId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("経費の削除に失敗しました");
    }
  },
};
