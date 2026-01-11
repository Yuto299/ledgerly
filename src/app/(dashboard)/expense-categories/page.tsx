"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import LoadingOverlay from "@/components/atoms/LoadingOverlay";
import { Modal } from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import {
  useExpenseCategories,
  useCreateExpenseCategory,
  useUpdateExpenseCategory,
  useDeleteExpenseCategory,
} from "@/features/expense-categories/hooks/useExpenseCategories";
import type { ExpenseCategoryResponse } from "@/features/expense-categories/schemas/expenseCategorySchema";
import { toast } from "sonner";

export default function ExpenseCategoriesPage() {
  const { data, isLoading } = useExpenseCategories();
  const createCategory = useCreateExpenseCategory();
  const updateCategory = useUpdateExpenseCategory();
  const deleteCategory = useDeleteExpenseCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#3b82f6" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = data?.categories || [];

  const handleOpenModal = (category?: ExpenseCategoryResponse) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, color: category.color || "#3b82f6" });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", color: "#3b82f6" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", color: "#3b82f6" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("カテゴリ名を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          categoryId: editingCategory.id,
          data: formData,
        });
        toast.success("カテゴリを更新しました");
      } else {
        await createCategory.mutateAsync({ ...formData, sortOrder: 0 });
        toast.success("カテゴリを作成しました");
      }
      handleCloseModal();
    } catch (error) {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このカテゴリを削除しますか？")) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success("カテゴリを削除しました");
    } catch (error) {
      toast.error("削除に失敗しました");
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">経費カテゴリ</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          新規カテゴリ
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">まだカテゴリが登録されていません</p>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            最初のカテゴリを作成
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: category.color || "#6b7280" }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      作成日:{" "}
                      {new Date(category.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "カテゴリを編集" : "新規カテゴリ"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="カテゴリ名" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 交通費"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="カラー">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                disabled={isSubmitting}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3b82f6"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : editingCategory ? "更新" : "作成"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
