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
    padding: 25,
    fontSize: 8,
    fontFamily: "NotoSansJP",
  },
  // タイトル部分
  titleBar: {
    backgroundColor: "#2563eb",
    padding: 7,
    marginBottom: 12,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  // ヘッダー情報（日付・番号）
  headerInfo: {
    position: "absolute",
    top: 25,
    right: 25,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  headerLabel: {
    fontSize: 7,
    marginRight: 8,
    color: "#ffffff",
  },
  headerValue: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#ffffff",
  },
  // 宛先と請求元
  infoSection: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  recipientBox: {
    width: "48%",
  },
  companyBox: {
    width: "48%",
    alignItems: "flex-end",
  },
  recipientName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
  },
  companyName: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 7,
    marginBottom: 1,
  },
  // 請求金額セクション
  totalAmountBox: {
    backgroundColor: "#2563eb",
    padding: 5,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalAmountLabel: {
    fontSize: 9,
    color: "#ffffff",
    fontWeight: "bold",
  },
  totalAmountValue: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  // 振込先情報
  bankInfoBox: {
    backgroundColor: "#2563eb",
    padding: 4,
    marginBottom: 3,
  },
  bankInfoTitle: {
    fontSize: 8,
    color: "#ffffff",
    fontWeight: "bold",
  },
  bankInfoContent: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 5,
    marginBottom: 8,
  },
  bankRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bankLabel: {
    width: 50,
    fontSize: 7,
  },
  bankValue: {
    fontSize: 7,
  },
  // テーブル
  table: {
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  tableHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    fontSize: 8,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#cbd5e1",
    minHeight: 20,
  },
  colItem: {
    width: "45%",
    paddingRight: 5,
  },
  colQty: {
    width: "12%",
    textAlign: "center",
  },
  colUnit: {
    width: "20%",
    textAlign: "right",
    paddingRight: 5,
  },
  colAmount: {
    width: "23%",
    textAlign: "right",
    fontWeight: "bold",
  },
  // 合計セクション
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: 150,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
  },
  summaryLabel: {
    fontSize: 7,
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 7,
    textAlign: "right",
  },
  summaryTotal: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  // 備考
  notesBox: {
    marginTop: 8,
  },
  notesTitle: {
    backgroundColor: "#2563eb",
    padding: 4,
    marginBottom: 3,
  },
  notesTitleText: {
    fontSize: 8,
    color: "#ffffff",
    fontWeight: "bold",
  },
  notesContent: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 5,
    minHeight: 30,
  },
  notesText: {
    fontSize: 7,
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
  const unpaidAmount = invoice.totalAmount - invoice.paidAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* タイトルバー */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>請求書</Text>
        </View>

        {/* 右上の日付・番号情報 */}
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.headerLabel}>発行日</Text>
            <Text style={styles.headerValue}>
              {formatDate(invoice.issuedAt)}
            </Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.headerLabel}>請求番号</Text>
            <Text style={styles.headerValue}>
              {invoice.invoiceNumber || "000001"}
            </Text>
          </View>
        </View>

        {/* 宛先と請求元 */}
        <View style={styles.infoSection}>
          {/* 宛先 */}
          <View style={styles.recipientBox}>
            <Text style={styles.recipientName}>
              {invoice.customer.name} 御中
            </Text>
            {invoice.customer.contactName && (
              <Text style={styles.infoText}>
                {invoice.customer.contactName}
              </Text>
            )}
          </View>

          {/* 請求元 */}
          <View style={styles.companyBox}>
            <Text style={styles.companyName}>
              {settings?.businessName || "事業者名未設定"}
            </Text>
            {settings?.representativeName && (
              <Text style={styles.infoText}>{settings.representativeName}</Text>
            )}
            {settings?.postalCode && settings?.address && (
              <Text style={styles.infoText}>
                〒{settings.postalCode} {settings.address}
              </Text>
            )}
            {!settings?.postalCode && settings?.address && (
              <Text style={styles.infoText}>{settings.address}</Text>
            )}
            {settings?.phone && (
              <Text style={styles.infoText}>電話: {settings.phone}</Text>
            )}
            {settings?.email && (
              <Text style={styles.infoText}>メール: {settings.email}</Text>
            )}
          </View>
        </View>

        {/* 請求金額ボックス */}
        <View style={styles.totalAmountBox}>
          <Text style={styles.totalAmountLabel}>ご請求金額（税込）</Text>
          <Text style={styles.totalAmountValue}>
            {formatCurrency(invoice.totalAmount)}
          </Text>
        </View>

        {/* 振込先情報 */}
        <View>
          <View style={styles.bankInfoBox}>
            <Text style={styles.bankInfoTitle}>振込先</Text>
          </View>
          <View style={styles.bankInfoContent}>
            {settings?.bankName || settings?.branchName ? (
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>銀行名:</Text>
                <Text style={styles.bankValue}>
                  {settings?.bankName || ""} {settings?.branchName || ""}
                </Text>
              </View>
            ) : (
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>銀行名:</Text>
                <Text style={styles.bankValue}>未設定</Text>
              </View>
            )}
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>口座種別:</Text>
              <Text style={styles.bankValue}>
                {settings?.accountType || "未設定"}
              </Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>口座番号:</Text>
              <Text style={styles.bankValue}>
                {settings?.accountNumber || "未設定"}
              </Text>
            </View>
            {settings?.accountHolder && (
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>口座名義:</Text>
                <Text style={styles.bankValue}>{settings.accountHolder}</Text>
              </View>
            )}
            <Text style={[styles.infoText, { marginTop: 3 }]}>
              振込手数料はお客様のご負担にてお願い致します。
            </Text>
          </View>
        </View>

        {/* 明細テーブル */}
        <View style={styles.table}>
          {/* ヘッダー */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colItem, styles.tableHeaderText]}>品名</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>数量</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>時間</Text>
            <Text style={[styles.colUnit, styles.tableHeaderText]}>単価</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>金額</Text>
          </View>

          {/* データ行 */}
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colItem}>
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colQty}>
                {item.hours ? `${item.hours}h` : "-"}
              </Text>
              <Text style={styles.colUnit}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={styles.colAmount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}

          {/* 空行 */}
          {Array.from({ length: Math.max(0, 10 - invoice.items.length) }).map(
            (_, index) => (
              <View key={`empty-${index}`} style={styles.tableRow}>
                <Text style={styles.colItem}> </Text>
                <Text style={styles.colQty}> </Text>
                <Text style={styles.colQty}> </Text>
                <Text style={styles.colUnit}> </Text>
                <Text style={styles.colAmount}> </Text>
              </View>
            )
          )}
        </View>

        {/* 合計セクション */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>小計</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(invoice.totalAmount)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>入金済</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(invoice.paidAmount)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryLabel}>合計</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(unpaidAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* 備考 */}
        <View style={styles.notesBox}>
          <View style={styles.notesTitle}>
            <Text style={styles.notesTitleText}>備考</Text>
          </View>
          <View style={styles.notesContent}>
            {settings?.invoiceNotes || invoice.notes ? (
              <Text style={styles.notesText}>
                {settings?.invoiceNotes || ""}
                {settings?.invoiceNotes && invoice.notes ? "\n" : ""}
                {invoice.notes || ""}
              </Text>
            ) : (
              <Text style={styles.notesText}> </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
