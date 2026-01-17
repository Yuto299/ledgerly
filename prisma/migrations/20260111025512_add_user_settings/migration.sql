-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT,
    "representative_name" TEXT,
    "postal_code" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "bank_name" TEXT,
    "branch_name" TEXT,
    "account_type" TEXT,
    "account_number" TEXT,
    "account_holder" TEXT,
    "invoice_prefix" TEXT DEFAULT 'INV',
    "tax_rate" DOUBLE PRECISION DEFAULT 0.10,
    "default_payment_days" INTEGER DEFAULT 30,
    "invoice_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
