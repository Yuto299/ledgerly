import {
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
  ExpenseCategoryListResponse,
} from "../schemas/expenseCategorySchema";

const API_BASE_URL = "/api";

/**
 * 経費カテゴリAPI Client
 */
export const expenseCategoryApi = {
  /**
   * カテゴリ一覧取得
   */
  async list(): Promise<ExpenseCategoryListResponse> {
    const response = await fetch(`${API_BASE_URL}/expense-categories`);
    if (!response.ok) {
      throw new Error("カテゴリ一覧の取得に失敗しました");
    }
    return response.json();
  },

  /**
   * カテゴリ作成
   */
  async create(data: CreateExpenseCategoryDto): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/expense-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("カテゴリの作成に失敗しました");
    }
    return response.json();
  },

  /**
   * カテゴリ更新
   */
  async update(
    categoryId: string,
    data: UpdateExpenseCategoryDto
  ): Promise<unknown> {
    const response = await fetch(
      `${API_BASE_URL}/expense-categories/${categoryId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("カテゴリの更新に失敗しました");
    }
    return response.json();
  },

  /**
   * カテゴリ削除
   */
  async delete(categoryId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/expense-categories/${categoryId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "カテゴリの削除に失敗しました");
    }
  },
};
