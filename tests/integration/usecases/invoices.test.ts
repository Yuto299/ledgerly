import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/infrastructure/db/prisma";
import { createInvoice } from "@/application/usecases/invoices/createInvoice";
import { updateInvoice } from "@/application/usecases/invoices/updateInvoice";

describe("請求書作成・更新の統合テスト", () => {
  let userId: string;
  let customerId: string;
  let projectId: string;

  beforeAll(async () => {
    // テスト用ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email: "invoice-test@example.com",
        password: "test-password",
        name: "Invoice Test User",
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
    await prisma.invoiceItem.deleteMany({ where: { invoice: { userId } } });
    await prisma.invoice.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { userId } });
    await prisma.customer.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  describe("createInvoice", () => {
    it("明細を含む請求書を作成できる", async () => {
      const invoiceData = {
        customerId,
        projectId,
        invoiceNumber: "TEST-001",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        notes: "テスト請求書",
        items: [
          {
            description: "開発作業",
            quantity: 10,
            unitPrice: 5000,
          },
          {
            description: "コンサルティング",
            quantity: 5,
            unitPrice: 8000,
          },
        ],
      };

      const invoice = await createInvoice(userId, invoiceData);

      expect(invoice).toBeDefined();
      expect(invoice.totalAmount).toBe(90000); // 10*5000 + 5*8000
      expect(invoice.status).toBe("DRAFT");
      expect(invoice.paidAmount).toBe(0);
      expect(invoice.invoiceNumber).toBe("TEST-001");

      // 明細が作成されているか確認
      const invoiceWithItems = await prisma.invoice.findFirst({
        where: { id: invoice.id },
        include: { items: true },
      });

      expect(invoiceWithItems?.items).toHaveLength(2);
      expect(invoiceWithItems?.items[0].amount).toBe(50000);
      expect(invoiceWithItems?.items[1].amount).toBe(40000);
    });

    it("明細の金額を正しく計算する", async () => {
      const invoiceData = {
        customerId,
        projectId,
        invoiceNumber: "TEST-002",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "テスト",
            quantity: 3,
            unitPrice: 10000,
          },
        ],
      };

      const invoice = await createInvoice(userId, invoiceData);

      expect(invoice.totalAmount).toBe(30000);
    });

    it("明細が空の場合は合計0円になる", async () => {
      const invoiceData = {
        customerId,
        projectId,
        invoiceNumber: "TEST-003",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [],
      };

      const invoice = await createInvoice(userId, invoiceData);

      expect(invoice.totalAmount).toBe(0);
    });
  });

  describe("updateInvoice", () => {
    it("明細を更新すると合計金額が再計算される", async () => {
      // 請求書を作成
      const invoice = await createInvoice(userId, {
        customerId,
        projectId,
        invoiceNumber: "TEST-UPDATE-001",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "初期明細",
            quantity: 1,
            unitPrice: 10000,
          },
        ],
      });

      expect(invoice.totalAmount).toBe(10000);

      // 明細を更新
      const updated = await updateInvoice(userId, invoice.id, {
        customerId,
        projectId,
        invoiceNumber: "TEST-UPDATE-001",
        issuedAt: "2026-01-01",
        dueAt: "2026-01-31",
        items: [
          {
            description: "更新明細1",
            quantity: 2,
            unitPrice: 15000,
          },
          {
            description: "更新明細2",
            quantity: 3,
            unitPrice: 10000,
          },
        ],
      });

      expect(updated?.totalAmount).toBe(60000); // 2*15000 + 3*10000

      // 古い明細は削除されているか確認
      const invoiceWithItems = await prisma.invoice.findFirst({
        where: { id: invoice.id },
        include: { items: true },
      });

      expect(invoiceWithItems?.items).toHaveLength(2);
    });
  });
});
