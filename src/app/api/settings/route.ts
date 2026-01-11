import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getSettings } from "@/application/usecases/settings/getSettings";
import { updateSettings } from "@/application/usecases/settings/updateSettings";
import { handleApiError } from "@/lib/api/errorHandler";
import { z } from "zod";

const updateSettingsSchema = z.object({
  businessName: z.string().optional().nullable(),
  representativeName: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  bankName: z.string().optional().nullable(),
  branchName: z.string().optional().nullable(),
  accountType: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  invoicePrefix: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(1).optional().nullable(),
  defaultPaymentDays: z.number().int().positive().optional().nullable(),
  invoiceNotes: z.string().optional().nullable(),
});

// GET /api/settings - 設定を取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const settings = await getSettings(session.user.id);

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/settings - 設定を更新
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    const settings = await updateSettings(session.user.id, validatedData);

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
