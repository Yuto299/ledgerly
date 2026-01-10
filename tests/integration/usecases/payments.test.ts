import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/infrastructure/db/prisma";
import { createInvoice } from "@/application/usecases/invoices/createInvoice";
import { registerPayment } from "@/application/usecases/payments/registerPayment";
import { deletePayment } from "@/application/usecases/payments/deletePayment";

describe("入金登録と自動ステータス更新の統合テスト", () => {
  let userId: string;
  let customerId: string;
  let projectId: string;

  beforeAll(async () => {
    // テスト用ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email: "payment-test@example.com",
        password: "test-password",
        name: "Payment Test User",
      },
    });
    userId = user.id;

    // テスト用顧客を作成
    const customer = await prisma.customer.create({
      data: {
        userId,
        name: "テスト顧客",
        email: "customer@example.com",
      },
    });
    customerId = customer.id;

    // テスト用案件を作成
    const project = await prisma.project.create({
      data: {
        userId,
        customerId,
        name: "テスト案件",
        status: "IN_PROGRESS",
        contractType: "FIXED",
      },
    });
    projectId = project.id;
  });

  afterAll(async () => {
    // テストデータをクリーンアップ
    await prisma.payment.deleteMany({ where: { invoice: { userId } } });
    await prisma.invoiceItem.deleteMany({ where: { invoice: { userId } } });
    await prisma.invoice.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { userId } });
    await prisma.customer.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  describe("registerPayment - 自動ステータス更新", () => {
    it("一部入金時はDRAFTからSENTに自動更新される", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "PAY-TEST-001",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 1,
            unitPrice: 100000,
          },
        ],
      });

      expect(invoice.status).toBe("DRAFT");
      expect(invoice.paidAmount).toBe(0);

      // 一部入金を登録
      await registerPayment(userId, invoice.id, {
        amount: 30000,
        paidAt: "2026-01-10",
        paymentMethod: "BANK_TRANSFER",
      });

      // ステータスがSENTに更新されているか確認
      const updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });

      expect(updatedInvoice?.status).toBe("SENT");
      expect(updatedInvoice?.paidAmount).toBe(30000);
    });

    it("全額入金時はステータスがPAIDに自動更新される", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "PAY-TEST-002",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 1,
            unitPrice: 100000,
          },
        ],
      });

      // 全額入金を登録
      await registerPayment(userId, invoice.id, {
        amount: 100000,
        paidAt: "2026-01-10",
        paymentMethod: "BANK_TRANSFER",
      });

      // ステータスがPAIDに更新されているか確認
      const updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });

      expect(updatedInvoice?.status).toBe("PAID");
      expect(updatedInvoice?.paidAmount).toBe(100000);
    });

    it("複数回の入金で合計が請求額に達するとPAIDになる", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "PAY-TEST-003",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 1,
            unitPrice: 100000,
          },
        ],
      });

      // 1回目の入金
      await registerPayment(userId, invoice.id, {
        amount: 30000,
        paidAt: "2026-01-10",
        paymentMethod: "BANK_TRANSFER",
      });

      let updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });
      expect(updatedInvoice?.status).toBe("SENT");
      expect(updatedInvoice?.paidAmount).toBe(30000);

      // 2回目の入金
      await registerPayment(userId, invoice.id, {
        amount: 40000,
        paidAt: "2026-01-15",
        paymentMethod: "BANK_TRANSFER",
      });

      updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });
      expect(updatedInvoice?.status).toBe("SENT");
      expect(updatedInvoice?.paidAmount).toBe(70000);

      // 3回目の入金（これで合計100000）
      await registerPayment(userId, invoice.id, {
        amount: 30000,
        paidAt: "2026-01-20",
        paymentMethod: "BANK_TRANSFER",
      });

      updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });
      expect(updatedInvoice?.status).toBe("PAID");
      expect(updatedInvoice?.paidAmount).toBe(100000);
    });

    it("過入金でもPAIDステータスになる", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "PAY-TEST-004",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 1,
            unitPrice: 100000,
          },
        ],
      });

      // 過入金
      await registerPayment(userId, invoice.id, {
        amount: 150000,
        paidAt: "2026-01-10",
        paymentMethod: "BANK_TRANSFER",
      });

      const updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });

      expect(updatedInvoice?.status).toBe("PAID");
      expect(updatedInvoice?.paidAmount).toBe(150000);
    });
  });

  describe("deletePayment - ステータス再計算", () => {
    it("入金を削除するとステータスが再計算される", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "PAY-TEST-005",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 1,
            unitPrice: 100000,
          },
        ],
      });

      // 全額入金
      const payment = await registerPayment(userId, invoice.id, {
        amount: 100000,
        paidAt: "2026-01-10",
        paymentMethod: "BANK_TRANSFER",
      });

      let updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });
      expect(updatedInvoice?.status).toBe("PAID");

      // 入金を削除
      await deletePayment(userId, payment.id);

      updatedInvoice = await prisma.invoice.findFirst({
        where: { id: invoice.id },
      });
      expect(updatedInvoice?.status).toBe("DRAFT");
      expect(updatedInvoice?.paidAmount).toBe(0);
    });
  });
});
