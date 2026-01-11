import Link from "next/link";
import Button from "@/components/atoms/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-700">Ledgerly</h1>
          <Link href="/login">
            <Button>ログイン</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            フリーランスの
            <br />
            <span className="text-slate-600">会計管理</span>を
            <br />
            シンプルに
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            請求書作成、経費管理、売上レポートまで。
            <br />
            フリーランスに必要な会計機能を、使いやすく。
          </p>
          <Link href="/signup">
            <Button className="text-lg px-8 py-3 bg-slate-600 hover:bg-slate-700">
              無料で始める
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                請求書作成
              </h3>
              <p className="text-gray-600">
                明細付きの請求書を簡単に作成。PDFダウンロードにも対応。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                経費管理
              </h3>
              <p className="text-gray-600">
                カテゴリ別に経費を記録。案件別の収支も一目で確認。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                レポート
              </h3>
              <p className="text-gray-600">
                売上推移や案件別の利益をグラフで可視化。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            その他の機能
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-slate-600 flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  顧客・案件管理
                </h4>
                <p className="text-gray-600 text-sm">
                  顧客情報と案件を一元管理
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-slate-600 flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">入金管理</h4>
                <p className="text-gray-600 text-sm">
                  請求書ごとの入金状況を記録
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-slate-600 flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  CSV エクスポート
                </h4>
                <p className="text-gray-600 text-sm">
                  請求書・経費データをCSV出力
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-slate-600 flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  支払いアラート
                </h4>
                <p className="text-gray-600 text-sm">
                  期限切れ・期限間近の請求書を通知
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto max-w-6xl text-center text-gray-600">
          <p>&copy; 2026 Ledgerly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
