import Link from "next/link";
import Button from "@/components/atoms/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
              Ledgerly
            </h1>
          </div>
          <Link href="/login">
            <Button className="bg-slate-600 hover:bg-slate-700 shadow-md">
              ログイン
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                フリーランス・個人事業主向け
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              会計管理を
              <br />
              <span className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-600 bg-clip-text text-transparent">
                もっとシンプルに
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              請求書作成から経費管理、売上分析まで。
              <br />
              <span className="font-semibold text-gray-700">
                フリーランスの会計業務を一つに
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button className="text-lg px-10 py-4 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                  今すぐ無料で始める
                  <svg
                    className="w-5 h-5 ml-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
              <span className="text-sm text-gray-500">
                クレジットカード不要・即座に利用開始
              </span>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-20 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-gradient-to-r from-slate-100 to-blue-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600 ml-4 font-medium">
                  Ledgerly Dashboard
                </span>
              </div>
              <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">今月の売上</div>
                    <div className="text-2xl font-bold text-slate-700">
                      ¥850,000
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">今月の経費</div>
                    <div className="text-2xl font-bold text-slate-700">
                      ¥120,000
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">利益</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ¥730,000
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-end justify-around p-4">
                  <div
                    className="w-12 bg-slate-600 rounded-t"
                    style={{ height: "40%" }}
                  ></div>
                  <div
                    className="w-12 bg-slate-600 rounded-t"
                    style={{ height: "65%" }}
                  ></div>
                  <div
                    className="w-12 bg-blue-600 rounded-t"
                    style={{ height: "85%" }}
                  ></div>
                  <div
                    className="w-12 bg-blue-600 rounded-t"
                    style={{ height: "70%" }}
                  ></div>
                  <div
                    className="w-12 bg-slate-400 rounded-t opacity-50"
                    style={{ height: "30%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              必要な機能を、すべて
            </h3>
            <p className="text-xl text-gray-600">
              会計業務に必要な機能を厳選して搭載
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                請求書作成
              </h3>
              <p className="text-gray-600 leading-relaxed">
                プロフェッショナルな請求書を数クリックで作成。PDF出力で即送付可能。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  PDF自動生成
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  明細・備考対応
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-slate-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                経費管理
              </h3>
              <p className="text-gray-600 leading-relaxed">
                カテゴリ別・案件別に経費を記録。確定申告の準備もスムーズに。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  カテゴリ分類
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  CSV出力対応
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                売上分析
              </h3>
              <p className="text-gray-600 leading-relaxed">
                月別・案件別の売上をグラフで可視化。ビジネスの状況を一目で把握。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  売上推移グラフ
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  案件別収支
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              なぜLedgerlyなのか
            </h3>
            <p className="text-xl text-gray-600">
              フリーランスのために設計された3つの理由
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">⚡</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                即座に使える
              </h4>
              <p className="text-gray-600 leading-relaxed">
                複雑な設定は不要。アカウント作成後すぐに請求書を発行できます。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🎯</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                シンプル設計
              </h4>
              <p className="text-gray-600 leading-relaxed">
                必要な機能だけを厳選。迷わず使える直感的なインターフェース。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">💰</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                完全無料
              </h4>
              <p className="text-gray-600 leading-relaxed">
                すべての機能を無料で利用可能。隠れたコストは一切ありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            今すぐ始めませんか？
          </h3>
          <p className="text-xl mb-10 opacity-90">
            アカウント作成は30秒。今日から会計業務を効率化できます。
          </p>
          <Link href="/signup">
            <Button className="text-lg px-12 py-5 bg-white text-slate-700 hover:bg-gray-100 shadow-2xl hover:scale-110 transition-all duration-200 font-bold">
              無料で始める
              <svg
                className="w-6 h-6 ml-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
          <p className="mt-6 text-sm opacity-75">
            クレジットカード不要 • 解約自由 • データ安全管理
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-white">Ledgerly</span>
              </div>
              <p className="text-sm">フリーランスの会計管理をシンプルに</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm">
                &copy; 2026 Ledgerly. All rights reserved.
              </p>
              <p className="text-xs mt-2">
                個人事業主・フリーランス向け会計管理システム
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
