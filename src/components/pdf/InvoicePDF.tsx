import "server-only";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/money/formatter";

const registerJapaneseFonts = () => {
  if (typeof window !== "undefined") return;

  const globalState = globalThis as unknown as {
    __ledgerlyPdfFontsRegistered?: boolean;
  };

  if (globalState.__ledgerlyPdfFontsRegistered) return;

  const fontPath = path.join(process.cwd(), "public/fonts/NotoSansJP.ttf");

  Font.register({
    family: "NotoSansJP",
    src: fontPath,
  });

  globalState.__ledgerlyPdfFontsRegistered = true;
};

registerJapaneseFonts();

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "NotoSansJP",
    color: "#000000",
  },
  // ヘッダー情報（日付・番号）
  headerInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  headerLabel: {
    fontSize: 9,
    marginRight: 5,
  },
  headerValue: {
    fontSize: 9,
  },
  // タイトル
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  // 宛先と請求元セクション
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  recipientBox: {
    width: "50%",
    marginTop: 10,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    marginBottom: 12,
  },
  subjectText: {
    fontSize: 10,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 9,
    marginBottom: 10,
  },
  companyBox: {
    width: "45%",
    alignItems: "flex-end",
    textAlign: "right",
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyInfoText: {
    fontSize: 9,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // 請求金額
  totalAmountSection: {
    marginBottom: 20,
  },
  totalAmountLabel: {
    fontSize: 11,
    marginBottom: 5,
  },
  totalAmountBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    width: "60%",
  },
  totalAmountCurrency: {
    fontSize: 12,
    marginRight: 10,
    marginBottom: 2,
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dueDateText: {
    fontSize: 9,
    marginTop: 5,
  },
  // テーブル
  table: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    height: 24,
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    minHeight: 24,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    height: "100%",
    justifyContent: "center",
  },
  colItem: {
    flex: 1,
  },
  colQty: {
    width: 50,
    textAlign: "center",
  },
  colUnit: {
    width: 80,
    textAlign: "right",
  },
  colAmount: {
    width: 100,
    textAlign: "right",
  },
  // 集計セクション
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: 230, // colQty + colUnit + colAmount
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    height: 24,
    alignItems: "center",
  },
  summaryLabel: {
    width: 130, // colQty + colUnit
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    height: "100%",
    justifyContent: "center",
    paddingTop: 6,
  },
  summaryValue: {
    width: 100, // colAmount
    fontSize: 9,
    textAlign: "right",
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    height: "100%",
    justifyContent: "center",
    paddingTop: 6,
  },
  // 振込先・備考
  footerSection: {
    marginTop: 30,
  },
  footerMessage: {
    fontSize: 9,
    marginBottom: 10,
  },
  bankInfoTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bankInfoText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  notesSection: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 8,
    lineHeight: 1.4,
  },
});

interface InvoiceItem {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
  hours?: number | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string | null;
  issuedAt: Date;
  dueAt: Date;
  totalAmount: number;
  paidAmount: number;
  notes?: string | null;
  customer: {
    name: string;
    email?: string | null;
    phone?: string | null;
    contactName?: string | null;
  };
  project?: {
    name: string;
  } | null;
  items: InvoiceItem[];
}

interface UserSettings {
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
  invoiceNotes?: string | null;
}

interface InvoicePDFProps {
  invoice: Invoice;
  settings?: UserSettings | null;
}

export const InvoicePDF = ({ invoice, settings }: InvoicePDFProps) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.floor(subtotal * 0.1); // 簡易的に10%計算

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 右上の日付・番号情報 */}
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.headerValue}>
              {formatDate(invoice.issuedAt)}
            </Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.headerLabel}>請求番号:</Text>
            <Text style={styles.headerValue}>
              {invoice.invoiceNumber || "000001"}
            </Text>
          </View>
        </View>

        {/* タイトル */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>請求書</Text>
        </View>

        {/* 宛先と請求元 */}
        <View style={styles.infoSection}>
          {/* 宛先 */}
          <View style={styles.recipientBox}>
            <Text style={styles.recipientName}>
              {invoice.customer.name} 御中
            </Text>
            {invoice.project?.name && (
              <Text style={styles.subjectText}>件名: {invoice.project.name}</Text>
            )}
            <Text style={styles.messageText}>下記の通りご請求申し上げます。</Text>
          </View>

          {/* 請求元 */}
          <View style={styles.companyBox}>
            <Text style={styles.companyName}>
              {settings?.businessName || "事業者名未設定"}
            </Text>
            {settings?.postalCode && (
              <Text style={styles.companyInfoText}>〒{settings.postalCode}</Text>
            )}
            {settings?.address && (
              <Text style={styles.companyInfoText}>{settings.address}</Text>
            )}
            {settings?.phone && (
              <Text style={styles.companyInfoText}>TEL: {settings.phone}</Text>
            )}
            {settings?.email && (
              <Text style={styles.companyInfoText}>Email: {settings.email}</Text>
            )}
            {settings?.representativeName && (
              <Text style={styles.companyInfoText}>
                代表者: {settings.representativeName}
              </Text>
            )}
          </View>
        </View>

        {/* 請求金額 */}
        <View style={styles.totalAmountSection}>
          <Text style={styles.totalAmountLabel}>ご請求金額</Text>
          <View style={styles.totalAmountBox}>
            <Text style={styles.totalAmountCurrency}>¥</Text>
            <Text style={styles.totalAmountValue}>
              {invoice.totalAmount.toLocaleString()} -
            </Text>
          </View>
          <Text style={styles.dueDateText}>
            お支払い期限: {formatDate(invoice.dueAt)}
          </Text>
        </View>

        {/* 明細テーブル */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.colItem]}>
              <Text style={styles.tableHeaderText}>品番・品名</Text>
            </View>
            <View style={[styles.tableCell, styles.colQty]}>
              <Text style={styles.tableHeaderText}>数量</Text>
            </View>
            <View style={[styles.tableCell, styles.colUnit]}>
              <Text style={styles.tableHeaderText}>単価</Text>
            </View>
            <View style={[styles.tableCell, styles.colAmount]}>
              <Text style={styles.tableHeaderText}>金額</Text>
            </View>
          </View>

          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.colItem]}>
                <Text>{item.name}</Text>
              </View>
              <View style={[styles.tableCell, styles.colQty]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCell, styles.colUnit]}>
                <Text>{item.unitPrice.toLocaleString()}</Text>
              </View>
              <View style={[styles.tableCell, styles.colAmount]}>
                <Text>{item.amount.toLocaleString()}</Text>
              </View>
            </View>
          ))}

          {/* 空行の追加（デザイン調整用） */}
          {Array.from({ length: Math.max(0, 8 - invoice.items.length) }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.colItem]} />
              <View style={[styles.tableCell, styles.colQty]} />
              <View style={[styles.tableCell, styles.colUnit]} />
              <View style={[styles.tableCell, styles.colAmount]} />
            </View>
          ))}
        </View>

        {/* 集計セクション */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <Text>小計</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text>{subtotal.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <Text>消費税 (10%)</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text>{tax.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <Text>合計</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text style={{ fontWeight: "bold" }}>
                  {invoice.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* フッター（振込先・備考） */}
        <View style={styles.footerSection}>
          <Text style={styles.footerMessage}>
            振込手数料は御負担下さいますようお願い申し上げます。
          </Text>
          <Text style={styles.bankInfoTitle}>お振込先:</Text>
          <Text style={styles.bankInfoText}>
            {settings?.bankName} {settings?.branchName} ({settings?.accountType}){" "}
            {settings?.accountNumber} {settings?.accountHolder}
          </Text>

          {(invoice.notes || settings?.invoiceNotes) && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>備考:</Text>
              <Text style={styles.notesText}>
                {invoice.notes || settings?.invoiceNotes}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
