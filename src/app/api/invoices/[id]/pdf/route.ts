import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getInvoiceById } from "@/application/usecases/invoices/getInvoiceById";
import { getSettings } from "@/application/usecases/settings/getSettings";
import { renderToStream } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/pdf/InvoicePDF";
import React from "react";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await getInvoiceById(session.user.id, id);

    if (!result) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const { invoice } = result;

    // ユーザー設定を取得
    const settings = await getSettings(session.user.id);

    console.log("Invoice data for PDF:", {
      id: invoice.id,
      hasCustomer: !!invoice.customer,
      hasItems: invoice.items?.length > 0,
      itemsCount: invoice.items?.length,
    });

    // PDF生成用のデータ準備
    const pdfInvoice = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      issuedAt: invoice.issuedAt,
      dueAt: invoice.dueAt,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      notes: invoice.notes,
      customer: {
        name: invoice.customer?.name || "顧客名なし",
        email: invoice.customer?.email || null,
        phone: invoice.customer?.phone || null,
        contactName: invoice.customer?.contactName || null,
      },
      project: invoice.project
        ? {
            name: invoice.project.name,
          }
        : null,
      items: invoice.items.map((item) => ({
        id: item.id,
        name: item.name || item.description || "（無題）",
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      })),
    };

    console.log("PDF invoice prepared:", {
      itemsCount: pdfInvoice.items.length,
      customerName: pdfInvoice.customer.name,
    });

    // PDF生成
    const pdfElement = React.createElement(InvoicePDF as any, {
      invoice: pdfInvoice,
      settings: {
        businessName: settings.businessName,
        representativeName: settings.representativeName,
        postalCode: settings.postalCode,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        bankName: settings.bankName,
        branchName: settings.branchName,
        accountType: settings.accountType,
        accountNumber: settings.accountNumber,
        accountHolder: settings.accountHolder,
        invoiceNotes: settings.invoiceNotes,
      },
    });

    console.log("Starting PDF stream rendering...");
    const stream = await renderToStream(pdfElement as any);

    console.log("PDF stream created, converting to buffer...");
    // ストリームをBufferに変換
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log("PDF buffer created, size:", buffer.length);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice_${
          invoice.invoiceNumber || invoice.id
        }.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
    });
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
