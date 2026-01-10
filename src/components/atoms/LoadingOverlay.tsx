import React from "react";
import Spinner from "./Spinner";

interface LoadingOverlayProps {
  message?: string;
}

/**
 * 全画面ローディングオーバーレイ
 */
export default function LoadingOverlay({
  message = "読み込み中...",
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
