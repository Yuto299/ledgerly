import Link from "next/link";
import Button from "@/components/atoms/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ledgerly - フリーランス向けシンプル会計管理",
  description:
    "請求書作成から経費管理、売上分析まで。フリーランス・個人事業主のための会計管理システム。無料プランで今すぐ始められます。",
  keywords: "フリーランス,会計管理,請求書作成,経費管理,個人事業主",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
          aria-label="メインナビゲーション"
        >
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Ledgerlyホーム"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">
                L
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
              Ledgerly
            </h1>
          </Link>
          <Link href="/login">
            <Button
              className="bg-slate-600 hover:bg-slate-700 shadow-md"
              aria-label="ログインページへ"
            >
              ログイン
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block animate-fade-in">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  フリーランス・個人事業主向け
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                会計管理を
                <br />
                <span className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-600 bg-clip-text text-transparent">
                  もっとシンプルに
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                請求書作成から経費管理、売上分析まで。フリーランスの会計業務を一つのツールで完結させましょう。
              </p>

              <div>
                <Link href="/signup">
                  <Button
                    className="text-base px-8 py-3 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    aria-label="無料で会員登録を始める"
                  >
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
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>クレジットカード不要</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>30秒で登録完了</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>無料プランで全機能利用可</span>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative lg:block">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2 font-medium">
                    Ledgerly Dashboard
                  </span>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        今月の売上
                      </div>
                      <div className="text-lg font-bold text-slate-700">
                        ¥850,000
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        今月の経費
                      </div>
                      <div className="text-lg font-bold text-slate-700">
                        ¥120,000
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">利益</div>
                      <div className="text-lg font-bold text-blue-600">
                        ¥730,000
                      </div>
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-end justify-around p-4">
                    <div
                      className="w-10 bg-slate-600 rounded-t"
                      style={{ height: "40%" }}
                    ></div>
                    <div
                      className="w-10 bg-slate-600 rounded-t"
                      style={{ height: "65%" }}
                    ></div>
                    <div
                      className="w-10 bg-blue-600 rounded-t"
                      style={{ height: "85%" }}
                    ></div>
                    <div
                      className="w-10 bg-blue-600 rounded-t"
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className="w-10 bg-slate-400 rounded-t opacity-50"
                      style={{ height: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-24 px-4 bg-white"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight tracking-tight"
            >
              必要な機能を、すべて
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              フリーランスの会計業務に必要な機能を厳選
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div
                className="bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                請求書作成
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                プロフェッショナルな請求書を数クリックで作成。PDF出力で即送付可能。
              </p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                経費管理
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                カテゴリ別・案件別に経費を記録。確定申告の準備もスムーズに。
              </p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                売上分析
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                月別・案件別の売上をグラフで可視化。ビジネスの状況を一目で把握。
              </p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
                <li className="flex items-center text-sm text-gray-600 leading-relaxed">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
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
      <section
        className="py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              id="benefits-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              なぜLedgerlyなのか
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold leading-relaxed">
              フリーランスのために設計された3つの理由
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-orange-300">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl w-20 h-20 flex items-center justify-center mb-8 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-5xl font-light">
                  bolt
                </span>
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
                登録後<span className="text-orange-500">3分</span>で請求書完成
              </h4>
              <p className="text-base text-gray-700 leading-7">
                面倒な初期設定は一切不要。テンプレートを選んで、顧客情報と金額を入力するだけ。今日から請求業務を効率化できます。
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-pink-300">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl w-20 h-20 flex items-center justify-center mb-8 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-5xl font-light">
                  track_changes
                </span>
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
                <span className="text-pink-500">迷わない</span>操作性
              </h4>
              <p className="text-base text-gray-700 leading-7">
                会計ソフトが初めての方でも安心。直感的なデザインで、やりたいことがすぐに見つかる。ストレスフリーな会計管理を実現します。
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-slate-400">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl w-20 h-20 flex items-center justify-center mb-8 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-5xl font-light">
                  diamond
                </span>
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
                <span className="text-slate-700">ずっと無料</span>で使える
              </h4>
              <p className="text-base text-gray-700 leading-7">
                月10件までの請求書なら永久無料。クレジットカードの登録も不要。事業が成長したら、お得な有料プランへ簡単アップグレード。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        className="py-24 px-4 bg-white"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                シンプルな料金プラン
              </span>
            </div>
            <h2
              id="pricing-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight tracking-tight"
            >
              あなたに合ったプランを
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              まずは無料で始めて、成長に合わせてアップグレード
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <article className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
                  フリープラン
                </h3>
                <div className="flex items-end justify-center gap-2 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 leading-none tracking-tight">
                    ¥0
                  </span>
                  <span className="text-gray-600 mb-2 leading-relaxed">
                    /月
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  個人事業を始めたばかりの方に
                </p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    請求書作成（月10件まで）
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">基本的な経費管理</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">顧客管理（50件まで）</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">基本的なレポート</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">PDF出力</span>
                </li>
              </ul>

              <Link href="/signup" className="block">
                <Button
                  className="w-full py-3 bg-gray-700 hover:bg-gray-800"
                  aria-label="フリープランで無料登録"
                >
                  無料で始める
                </Button>
              </Link>
            </article>

            {/* Premium Plan */}
            <article className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-2xl border-2 border-blue-500 p-8 relative hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span
                  className="bg-gradient-to-r from-blue-600 to-slate-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                  aria-label="おすすめプラン"
                >
                  おすすめ
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
                  プレミアムプラン
                </h3>
                <div className="flex items-end justify-center gap-2 mb-4">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent leading-none tracking-tight">
                    ¥980
                  </span>
                  <span className="text-gray-600 mb-2 leading-relaxed">
                    /月
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  本格的にビジネスを成長させたい方に
                </p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    請求書作成（無制限）
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    高度な経費管理・分析
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    顧客管理（無制限）
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    詳細なレポート・分析
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    CSV一括インポート
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    優先サポート
                  </span>
                </li>
              </ul>

              <Link href="/signup" className="block">
                <Button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 shadow-lg"
                  aria-label="プレミアムプランで登録"
                >
                  プレミアムを始める
                </Button>
              </Link>
            </article>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              すべてのプランで{" "}
              <span className="font-semibold">14日間の返金保証</span> 付き
            </p>
            <p className="text-gray-500 text-xs mt-2">
              お支払いはクレジットカードで簡単・安全に処理されます
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-4 bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 text-white relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight"
          >
            今すぐ始めませんか？
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-10 opacity-90 leading-relaxed">
            アカウント作成は30秒。今日から会計業務を効率化。
          </p>
          <Link href="/signup" className="inline-block w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 bg-white text-slate-700 hover:bg-gray-100 shadow-2xl hover:scale-110 transition-all duration-200 font-bold"
              aria-label="無料で会員登録を開始"
            >
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
            まずは無料で試せる • 解約自由 • データ安全管理
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4 bg-gray-900 text-gray-400"
        aria-label="フッター"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <div
                  className="w-8 h-8 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
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
              <p className="text-xs mt-2 text-gray-500">
                個人事業主・フリーランス向け会計管理システム
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
