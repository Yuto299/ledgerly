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
  },
  // タイトル部分
  titleBar: {
    backgroundColor: "#2563eb",
    padding: 10,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  // ヘッダー情報（日付・番号）
  headerInfo: {
    position: "absolute",
    top: 40,
    right: 40,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  headerLabel: {
    fontSize: 9,
    marginRight: 10,
  },
  headerValue: {
    fontSize: 9,
    fontWeight: "bold",
  },
  // 宛先と請求元
  infoSection: {
    flexDirection: "row",
    marginBottom: 15,
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
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 8,
    marginBottom: 2,
  },
  // 請求金額セクション
  totalAmountBox: {
    backgroundColor: "#2563eb",
    padding: 8,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalAmountLabel: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
  },
  totalAmountValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  // 振込先情報
  bankInfoBox: {
    backgroundColor: "#2563eb",
    padding: 6,
    marginBottom: 5,
  },
  bankInfoTitle: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  bankInfoContent: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 8,
    marginBottom: 15,
  },
  bankRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bankLabel: {
    width: 60,
    fontSize: 8,
  },
  bankValue: {
    fontSize: 8,
  },
  // テーブル
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#dbeafe",
    padding: 5,
    fontWeight: "bold",
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    fontSize: 8,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#cbd5e1",
  },
  colItem: {
    width: "40%",
  },
  colQty: {
    width: "12%",
    textAlign: "center",
  },
  colUnit: {
    width: "18%",
    textAlign: "right",
  },
  colAmount: {
    width: "18%",
    textAlign: "right",
  },
  // 合計セクション
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: 180,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 9,
    textAlign: "right",
  },
  summaryTotal: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  // 備考
  notesBox: {
    marginTop: 15,
  },
  notesTitle: {
    backgroundColor: "#2563eb",
    padding: 6,
    marginBottom: 5,
  },
  notesTitleText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  notesContent: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 8,
    minHeight: 40,
  },
  notesText: {
    fontSize: 8,
  },
});

interface InvoiceItem {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string | null;
  status: string;
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

interface InvoicePDFProps {
  invoice: Invoice;
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export const InvoicePDF = ({ invoice, companyInfo }: InvoicePDFProps) => {
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
              {companyInfo?.name || "あなたの会社名"}
            </Text>
            {companyInfo?.address && (
              <Text style={styles.infoText}>{companyInfo.address}</Text>
            )}
            {companyInfo?.phone && (
              <Text style={styles.infoText}>電話: {companyInfo.phone}</Text>
            )}
            {companyInfo?.email && (
              <Text style={styles.infoText}>メール: {companyInfo.email}</Text>
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
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>銀行名:</Text>
              <Text style={styles.bankValue}>○○銀行 ○○支店</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>口座種別:</Text>
              <Text style={styles.bankValue}>普通</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>口座番号:</Text>
              <Text style={styles.bankValue}>1234567</Text>
            </View>
            <Text style={[styles.infoText, { marginTop: 3 }]}>
              振込手数料はお客様のご負担にてお願い致します。
            </Text>
          </View>
        </View>

        {/* 明細テーブル */}
        <View style={styles.table}>
          {/* ヘッダー */}
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>品名</Text>
            <Text style={styles.colQty}>数量</Text>
            <Text style={styles.colUnit}>単価</Text>
            <Text style={styles.colAmount}>金額</Text>
          </View>

          {/* データ行 */}
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colItem}>
                <Text>{item.name}</Text>
                {item.description && (
                  <Text style={{ fontSize: 7, color: "#6b7280" }}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
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
            {invoice.notes ? (
              <Text style={styles.notesText}>{invoice.notes}</Text>
            ) : (
              <Text style={styles.notesText}> </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
