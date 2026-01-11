"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";

interface Settings {
  businessName?: string | null;
  representativeName?: string | null;
  postalCode?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  accountType?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
  invoicePrefix?: string | null;
  taxRate?: number | null;
  defaultPaymentDays?: number | null;
  invoiceNotes?: string | null;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Settings>({});

  // 設定を取得
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("設定の取得に失敗しました");
      return res.json();
    },
  });

  // 設定データが取得できたらフォームにセット
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // 設定を更新
  const updateMutation = useMutation({
    mutationFn: async (data: Settings) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("設定の更新に失敗しました");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      alert("設定を保存しました");
    },
    onError: () => {
      alert("設定の保存に失敗しました");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof Settings, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">設定</h1>
        <p className="text-gray-600">
          請求書に表示される情報を設定してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 事業者情報 */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">事業者情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="businessName">屋号・事業者名</Label>
              <Input
                id="businessName"
                value={formData.businessName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("businessName", e.target.value)
                }
                placeholder="例: 株式会社サンプル"
              />
            </div>
            <div>
              <Label htmlFor="representativeName">代表者名</Label>
              <Input
                id="representativeName"
                value={formData.representativeName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("representativeName", e.target.value)
                }
                placeholder="例: 山田太郎"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("postalCode", e.target.value)
                }
                placeholder="例: 123-4567"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("address", e.target.value)
                }
                placeholder="例: 東京都渋谷区渋谷1-2-3"
              />
            </div>
            <div>
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("phone", e.target.value)
                }
                placeholder="例: 03-1234-5678"
              />
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", e.target.value)
                }
                placeholder="例: info@example.com"
              />
            </div>
          </div>
        </Card>

        {/* 銀行口座情報 */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">銀行口座情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bankName">銀行名</Label>
              <Input
                id="bankName"
                value={formData.bankName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("bankName", e.target.value)
                }
                placeholder="例: 三菱UFJ銀行"
              />
            </div>
            <div>
              <Label htmlFor="branchName">支店名</Label>
              <Input
                id="branchName"
                value={formData.branchName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("branchName", e.target.value)
                }
                placeholder="例: 渋谷支店"
              />
            </div>
            <div>
              <Label htmlFor="accountType">口座種別</Label>
              <select
                id="accountType"
                value={formData.accountType || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleChange("accountType", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </div>
            <div>
              <Label htmlFor="accountNumber">口座番号</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("accountNumber", e.target.value)
                }
                placeholder="例: 1234567"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="accountHolder">口座名義</Label>
              <Input
                id="accountHolder"
                value={formData.accountHolder || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("accountHolder", e.target.value)
                }
                placeholder="例: ヤマダタロウ"
              />
            </div>
          </div>
        </Card>

        {/* 請求書設定 */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">請求書設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="invoicePrefix">請求書番号プレフィックス</Label>
              <Input
                id="invoicePrefix"
                value={formData.invoicePrefix || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("invoicePrefix", e.target.value)
                }
                placeholder="例: INV"
              />
              <p className="mt-1 text-sm text-gray-500">
                請求書番号の先頭に付く文字列
              </p>
            </div>
            <div>
              <Label htmlFor="taxRate">消費税率（%）</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={
                  formData.taxRate !== null && formData.taxRate !== undefined
                    ? formData.taxRate * 100
                    : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(
                    "taxRate",
                    e.target.value === "" ? 0 : parseFloat(e.target.value) / 100
                  )
                }
                placeholder="例: 10"
              />
            </div>
            <div>
              <Label htmlFor="defaultPaymentDays">
                デフォルト支払期限（日数）
              </Label>
              <Input
                id="defaultPaymentDays"
                type="number"
                min="1"
                value={formData.defaultPaymentDays || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(
                    "defaultPaymentDays",
                    e.target.value === "" ? 30 : parseInt(e.target.value)
                  )
                }
                placeholder="例: 30"
              />
              <p className="mt-1 text-sm text-gray-500">
                請求日から何日後を支払期限とするか
              </p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="invoiceNotes">請求書デフォルト備考</Label>
              <textarea
                id="invoiceNotes"
                value={formData.invoiceNotes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange("invoiceNotes", e.target.value)
                }
                placeholder="請求書に毎回表示する備考を入力してください"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-8"
          >
            {updateMutation.isPending ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  );
}
