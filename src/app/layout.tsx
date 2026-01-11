import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ledgerly | 個人事業向け売上・経費管理",
  description:
    "副業・個人事業における顧客管理・案件管理・請求管理・入金管理・経費管理を一元化",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
