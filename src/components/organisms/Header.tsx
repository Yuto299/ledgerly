"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="lg:hidden w-12">
          {/* スペーサー（モバイルメニューボタンの分） */}
        </div>
        <div className="flex-1">{/* 検索バーなど（将来追加） */}</div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {session?.user && (
            <>
              <span className="text-xs md:text-sm text-gray-700 truncate max-w-[150px] md:max-w-none">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs md:text-sm text-gray-700 hover:text-gray-900 px-2 md:px-3 py-1.5 md:py-2 rounded hover:bg-gray-100 whitespace-nowrap"
              >
                ログアウト
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
