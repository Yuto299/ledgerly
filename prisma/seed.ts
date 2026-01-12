import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ユーザー作成
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@ledgerly.com" },
    update: {},
    create: {
      email: "demo@ledgerly.com",
      password: hashedPassword,
      name: "デモユーザー",
    },
  });

  console.log("✅ User created:", user.email);

  // 経費カテゴリ作成
  const categories = [
    { name: "通信費", color: "#3b82f6" },
    { name: "交通費", color: "#10b981" },
    { name: "ソフトウェア", color: "#8b5cf6" },
    { name: "広告費", color: "#f59e0b" },
    { name: "外注費", color: "#ef4444" },
    { name: "その他", color: "#6b7280" },
  ];

  for (const [index, category] of categories.entries()) {
    const existing = await prisma.expenseCategory.findFirst({
      where: {
        userId: user.id,
        name: category.name,
      },
    });

    if (!existing) {
      await prisma.expenseCategory.create({
        data: {
          userId: user.id,
          name: category.name,
          color: category.color,
          sortOrder: index,
        },
      });
    }
  }

  console.log("✅ Expense categories created");

  // 顧客作成
  const customer1 = await prisma.customer.create({
    data: {
      userId: user.id,
      name: "株式会社サンプル",
      contactName: "山田太郎",
      email: "yamada@example.com",
      phone: "03-1234-5678",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: user.id,
      name: "株式会社テスト",
      contactName: "佐藤花子",
      email: "sato@example.com",
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      userId: user.id,
      name: "合同会社デザインワークス",
      contactName: "田中一郎",
      email: "tanaka@design-works.co.jp",
      phone: "03-5555-1234",
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      userId: user.id,
      name: "株式会社アプリケーションズ",
      contactName: "鈴木美咲",
      email: "suzuki@applications.com",
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      userId: user.id,
      name: "エンタープライズ株式会社",
      contactName: "高橋健太",
      email: "takahashi@enterprise.co.jp",
      phone: "03-9876-5432",
    },
  });

  console.log("✅ Customers created");

  // 案件作成
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      customerId: customer1.id,
      name: "Webサイト制作",
      description: "コーポレートサイトのリニューアル",
      contractType: "FIXED",
      contractAmount: 500000,
      startDate: new Date("2026-01-01"),
      status: "IN_PROGRESS",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: user.id,
      customerId: customer2.id,
      name: "システム保守",
      description: "月次保守契約",
      contractType: "FIXED",
      contractAmount: 100000,
      startDate: new Date("2026-01-01"),
      status: "IN_PROGRESS",
    },
  });

  const project3 = await prisma.project.create({
    data: {
      userId: user.id,
      customerId: customer3.id,
      name: "リニューアル",
      description: "ECサイトのリニューアルプロジェクト",
      contractType: "FIXED",
      contractAmount: 800000,
      startDate: new Date("2025-12-01"),
      status: "IN_PROGRESS",
    },
  });

  const project4 = await prisma.project.create({
    data: {
      userId: user.id,
      customerId: customer4.id,
      name: "モバイルアプリ開発",
      description: "iOS/Androidアプリの新規開発",
      contractType: "FIXED",
      contractAmount: 1200000,
      startDate: new Date("2025-11-01"),
      status: "IN_PROGRESS",
    },
  });

  const project5 = await prisma.project.create({
    data: {
      userId: user.id,
      customerId: customer5.id,
      name: "業務システム構築",
      description: "社内業務システムのカスタマイズ",
      contractType: "FIXED",
      contractAmount: 600000,
      startDate: new Date("2025-10-01"),
      status: "COMPLETED",
    },
  });

  console.log("✅ Projects created");

  // 請求書作成（複数月のデータ）
  const invoice1 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer1.id,
      projectId: project1.id,
      invoiceNumber: "INV-2025-11-001",
      status: "PAID",
      issuedAt: new Date("2025-11-01"),
      dueAt: new Date("2025-11-30"),
      totalAmount: 300000,
      paidAmount: 300000,
      items: {
        create: [
          {
            name: "Webサイト設計費",
            description: "サイト構成・デザイン設計",
            quantity: 1,
            unitPrice: 300000,
            amount: 300000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer2.id,
      projectId: project2.id,
      invoiceNumber: "INV-2025-12-001",
      status: "PAID",
      issuedAt: new Date("2025-12-01"),
      dueAt: new Date("2025-12-31"),
      totalAmount: 100000,
      paidAmount: 100000,
      items: {
        create: [
          {
            name: "システム保守費",
            description: "12月分",
            quantity: 1,
            unitPrice: 100000,
            amount: 100000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer1.id,
      projectId: project1.id,
      invoiceNumber: "INV-2026-01-001",
      status: "SENT",
      issuedAt: new Date("2026-01-05"),
      dueAt: new Date("2026-01-31"),
      totalAmount: 500000,
      paidAmount: 250000,
      items: {
        create: [
          {
            name: "Webサイト制作費",
            description: "コーポレートサイトリニューアル一式",
            quantity: 1,
            unitPrice: 500000,
            amount: 500000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice4 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer2.id,
      projectId: project2.id,
      invoiceNumber: "INV-2026-01-002",
      status: "PAID",
      issuedAt: new Date("2026-01-01"),
      dueAt: new Date("2026-01-31"),
      totalAmount: 100000,
      paidAmount: 100000,
      items: {
        create: [
          {
            name: "システム保守費",
            description: "1月分",
            quantity: 1,
            unitPrice: 100000,
            amount: 100000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice5 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer3.id,
      projectId: project3.id,
      invoiceNumber: "INV-2025-12-002",
      status: "PAID",
      issuedAt: new Date("2025-12-05"),
      dueAt: new Date("2025-12-31"),
      totalAmount: 400000,
      paidAmount: 400000,
      items: {
        create: [
          {
            name: "ECサイト設計費",
            description: "要件定義・画面設計",
            quantity: 1,
            unitPrice: 400000,
            amount: 400000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice6 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer4.id,
      projectId: project4.id,
      invoiceNumber: "INV-2025-11-002",
      status: "PAID",
      issuedAt: new Date("2025-11-10"),
      dueAt: new Date("2025-11-30"),
      totalAmount: 600000,
      paidAmount: 600000,
      items: {
        create: [
          {
            name: "アプリ開発費（第1フェーズ）",
            description: "画面設計・基本機能実装",
            quantity: 1,
            unitPrice: 600000,
            amount: 600000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice7 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer5.id,
      projectId: project5.id,
      invoiceNumber: "INV-2025-10-001",
      status: "PAID",
      issuedAt: new Date("2025-10-15"),
      dueAt: new Date("2025-11-15"),
      totalAmount: 600000,
      paidAmount: 600000,
      items: {
        create: [
          {
            name: "業務システム構築費",
            description: "カスタマイズ開発一式",
            quantity: 1,
            unitPrice: 600000,
            amount: 600000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const invoice8 = await prisma.invoice.create({
    data: {
      userId: user.id,
      customerId: customer4.id,
      projectId: project4.id,
      invoiceNumber: "INV-2026-01-003",
      status: "PAID",
      issuedAt: new Date("2026-01-05"),
      dueAt: new Date("2026-02-05"),
      totalAmount: 600000,
      paidAmount: 600000,
      items: {
        create: [
          {
            name: "アプリ開発費（第2フェーズ）",
            description: "詳細機能実装・テスト",
            quantity: 1,
            unitPrice: 600000,
            amount: 600000,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log("✅ Invoices created");

  // 入金作成
  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 300000,
      paidAt: new Date("2025-11-15"),
      paymentMethod: "BANK_TRANSFER",
      notes: "全額入金",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice2.id,
      amount: 100000,
      paidAt: new Date("2025-12-10"),
      paymentMethod: "BANK_TRANSFER",
      notes: "12月分保守費",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice3.id,
      amount: 250000,
      paidAt: new Date("2026-01-10"),
      paymentMethod: "BANK_TRANSFER",
      notes: "前金",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice4.id,
      amount: 100000,
      paidAt: new Date("2026-01-08"),
      paymentMethod: "BANK_TRANSFER",
      notes: "1月分保守費",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice5.id,
      amount: 400000,
      paidAt: new Date("2025-12-20"),
      paymentMethod: "BANK_TRANSFER",
      notes: "ECサイト設計費",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice6.id,
      amount: 600000,
      paidAt: new Date("2025-11-25"),
      paymentMethod: "BANK_TRANSFER",
      notes: "アプリ開発第1フェーズ",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice7.id,
      amount: 600000,
      paidAt: new Date("2025-11-10"),
      paymentMethod: "BANK_TRANSFER",
      notes: "業務システム構築費",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice8.id,
      amount: 600000,
      paidAt: new Date("2026-01-12"),
      paymentMethod: "BANK_TRANSFER",
      notes: "アプリ開発第2フェーズ",
    },
  });

  console.log("✅ Payments created");

  // 経費作成（複数月・複数カテゴリ）
  const allCategories = await prisma.expenseCategory.findMany({
    where: { userId: user.id },
  });

  const categoryMap = new Map(allCategories.map((c) => [c.name, c.id]));

  // 11月の経費
  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("通信費")!,
      projectId: project1.id,
      date: new Date("2025-11-05"),
      amount: 5000,
      paymentMethod: "CREDIT_CARD",
      description: "インターネット回線（11月）",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("ソフトウェア")!,
      projectId: project1.id,
      date: new Date("2025-11-10"),
      amount: 15000,
      paymentMethod: "CREDIT_CARD",
      description: "Adobe Creative Cloud",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("交通費")!,
      projectId: project1.id,
      date: new Date("2025-11-15"),
      amount: 3000,
      paymentMethod: "CASH",
      description: "クライアント打ち合わせ（電車代）",
    },
  });

  // 12月の経費
  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("通信費")!,
      projectId: project2.id,
      date: new Date("2025-12-05"),
      amount: 5000,
      paymentMethod: "CREDIT_CARD",
      description: "インターネット回線（12月）",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("外注費")!,
      projectId: project1.id,
      date: new Date("2025-12-10"),
      amount: 50000,
      paymentMethod: "BANK_TRANSFER",
      description: "ライター外注費",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("広告費")!,
      date: new Date("2025-12-15"),
      amount: 30000,
      paymentMethod: "CREDIT_CARD",
      description: "Google広告費",
    },
  });

  // 1月の経費
  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("通信費")!,
      projectId: project1.id,
      date: new Date("2026-01-05"),
      amount: 5000,
      paymentMethod: "CREDIT_CARD",
      description: "インターネット回線（1月）",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("ソフトウェア")!,
      date: new Date("2026-01-08"),
      amount: 15000,
      paymentMethod: "CREDIT_CARD",
      description: "Adobe Creative Cloud",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("交通費")!,
      projectId: project1.id,
      date: new Date("2026-01-09"),
      amount: 8000,
      paymentMethod: "CASH",
      description: "クライアント打ち合わせ（タクシー代）",
    },
  });

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: categoryMap.get("その他")!,
      date: new Date("2026-01-10"),
      amount: 2000,
      paymentMethod: "CASH",
      description: "事務用品",
    },
  });

  console.log("✅ Expenses created");
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
