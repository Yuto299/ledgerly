/**
 * デフォルトの経費カテゴリ
 */
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "交通費", color: "#3B82F6", sortOrder: 1 },
  { name: "通信費", color: "#8B5CF6", sortOrder: 2 },
  { name: "接待交際費", color: "#EC4899", sortOrder: 3 },
  { name: "消耗品費", color: "#F59E0B", sortOrder: 4 },
  { name: "水道光熱費", color: "#10B981", sortOrder: 5 },
  { name: "地代家賃", color: "#6366F1", sortOrder: 6 },
  { name: "外注費", color: "#14B8A6", sortOrder: 7 },
  { name: "広告宣伝費", color: "#F97316", sortOrder: 8 },
  { name: "研修費", color: "#06B6D4", sortOrder: 9 },
  { name: "その他", color: "#6B7280", sortOrder: 10 },
] as const;
