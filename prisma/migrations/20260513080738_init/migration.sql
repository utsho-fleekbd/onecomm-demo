-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('TRIAL', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BusinessMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CourierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CourierConfigMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateEnum
CREATE TYPE "CourierConfigStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CourierDeliveryZoneStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CourierShippingChargeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CourierShipmentStatus" AS ENUM ('PENDING', 'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CourierReceivableStatus" AS ENUM ('PENDING', 'PARTIALLY_SETTLED', 'SETTLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "CourierSettlementStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinanceAccountType" AS ENUM ('CASH', 'BANK', 'MOBILE_BANKING', 'PAYMENT_GATEWAY', 'OTHER');

-- CreateEnum
CREATE TYPE "FinanceAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FinanceTransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "FinanceExpenseCategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FinanceExpenseStatus" AS ENUM ('DRAFT', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancePartyType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'COURIER', 'PAYMENT_GATEWAY', 'EMPLOYEE', 'OTHER');

-- CreateEnum
CREATE TYPE "FinanceReceivableStatus" AS ENUM ('PENDING', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancePayableStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinanceSourceType" AS ENUM ('ORDER', 'INVOICE', 'SUPPLIER_INVOICE', 'SUPPLIER_PAYMENT', 'COURIER_RECEIVABLE', 'COURIER_SETTLEMENT', 'EXPENSE', 'REFUND', 'MANUAL');

-- CreateEnum
CREATE TYPE "FinanceJournalLineType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "InventoryLocationType" AS ENUM ('WAREHOUSE', 'SHOWROOM');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('PURCHASE_IN', 'PURCHASE_RETURN_OUT', 'SALE_OUT', 'SALE_RETURN_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RESERVED', 'RESERVATION_RELEASED');

-- CreateEnum
CREATE TYPE "InventoryReferenceType" AS ENUM ('PURCHASE_ORDER', 'SUPPLIER_INVOICE', 'PURCHASE_RETURN', 'ORDER', 'ORDER_RETURN', 'STOCK_ADJUSTMENT', 'STOCK_TRANSFER', 'MANUAL');

-- CreateEnum
CREATE TYPE "InventoryAdjustmentType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "InventoryAdjustmentStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryTransferStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'SHIPPED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MediaFileType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaAssetStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MediaTagStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "NotificationTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('SYSTEM_USER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER', 'PAYMENT', 'INVENTORY', 'SUBSCRIPTION', 'SYSTEM', 'MARKETING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "OrderCustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "OrderAddressType" AS ENUM ('HOME', 'OFFICE', 'SHIPPING', 'BILLING', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderCartStatus" AS ENUM ('ACTIVE', 'ORDERED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ONLINE', 'POS', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('WEBSITE', 'POS', 'ADMIN_PANEL', 'MOBILE_APP');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "OrderDiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "OrderDiscountSource" AS ENUM ('MANUAL', 'COUPON', 'PROMOTION');

-- CreateEnum
CREATE TYPE "OrderPaymentMethod" AS ENUM ('CASH', 'COD', 'BKASH', 'NAGAD', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderRefundMethod" AS ENUM ('CASH', 'BKASH', 'NAGAD', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderRefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PackageBillingCycle" AS ENUM ('FREE', 'MONTHLY', 'YEARLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PackageResetCycle" AS ENUM ('LIFETIME', 'DAILY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PackageSubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PackageSubscriptionAddonStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentGatewayStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentGatewayMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateEnum
CREATE TYPE "PaymentGatewayConfigStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CASH', 'COD', 'ONLINE', 'BANK_TRANSFER', 'CARD', 'MOBILE_BANKING', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethodStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentWebhookStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "ProductSimpleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CatalogProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductVariantStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RbacFeature" AS ENUM ('BUSINESS_MANAGEMENT', 'EMPLOYEE_MANAGEMENT', 'ROLE_PERMISSION_MANAGEMENT');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "CommonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRoleMapStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "SmsProviderStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SmsProviderConfigMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateEnum
CREATE TYPE "SmsProviderConfigStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SmsTemplateType" AS ENUM ('MARKETING', 'TRANSACTIONAL', 'ORDER', 'OTP', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SmsTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SmsCampaignType" AS ENUM ('PROMOTIONAL', 'TRANSACTIONAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SmsCampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "SmsRecipientStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "SmsLogStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SupplierProductMapStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SupplierPurchaseOrderStatus" AS ENUM ('DRAFT', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupplierInvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupplierPaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'BKASH', 'NAGAD', 'CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplierPurchaseReturnStatus" AS ENUM ('DRAFT', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SystemUserType" AS ENUM ('ADMIN', 'TENANT', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "SystemUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('EMAIL_VERIFICATION', 'EMAIL_CHANGE');

-- CreateEnum
CREATE TYPE "WebsiteTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebsiteDomainType" AS ENUM ('SUBDOMAIN', 'CUSTOM_DOMAIN');

-- CreateEnum
CREATE TYPE "WebsiteDomainVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebsiteDomainSslStatus" AS ENUM ('PENDING', 'ACTIVE', 'FAILED');

-- CreateEnum
CREATE TYPE "WebsitePageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebsitePageType" AS ENUM ('HOME', 'PRODUCT_LIST', 'PRODUCT_DETAILS', 'CATEGORY', 'CART', 'CHECKOUT', 'ABOUT', 'CONTACT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "WebsiteSectionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WebsiteComponentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "business_businesses" (
    "id" UUID NOT NULL,
    "owner_user_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "country" VARCHAR(100),
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "timezone" VARCHAR(100) NOT NULL DEFAULT 'Asia/Dhaka',
    "status" "BusinessStatus" NOT NULL DEFAULT 'TRIAL',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "business_businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_settings" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_prefix" VARCHAR(20) NOT NULL DEFAULT 'ORD',
    "invoice_prefix" VARCHAR(20) NOT NULL DEFAULT 'INV',
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
    "allow_backorder" BOOLEAN NOT NULL DEFAULT false,
    "auto_confirm_order" BOOLEAN NOT NULL DEFAULT false,
    "cod_enabled" BOOLEAN NOT NULL DEFAULT true,
    "online_payment_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_branding" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "primary_color" VARCHAR(20),
    "secondary_color" VARCHAR(20),
    "accent_color" VARCHAR(20),
    "font_family" VARCHAR(100),
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "business_branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_members" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "BusinessMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joined_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "business_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_couriers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "status" "CourierStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courier_couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_configs" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "courier_id" UUID NOT NULL,
    "config_data" JSONB NOT NULL,
    "mode" "CourierConfigMode" NOT NULL DEFAULT 'SANDBOX',
    "status" "CourierConfigStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "courier_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_delivery_zones" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "status" "CourierDeliveryZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "courier_delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_delivery_zone_areas" (
    "id" UUID NOT NULL,
    "delivery_zone_id" UUID NOT NULL,
    "area_name" VARCHAR(150) NOT NULL,
    "city" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courier_delivery_zone_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_shipping_charges" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "delivery_zone_id" UUID NOT NULL,
    "courier_id" UUID,
    "min_weight" DECIMAL(10,3),
    "max_weight" DECIMAL(10,3),
    "shipping_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cod_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CourierShippingChargeStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courier_shipping_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_shipments" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "courier_id" UUID,
    "delivery_zone_id" UUID,
    "shipment_no" VARCHAR(100) NOT NULL,
    "consignment_id" VARCHAR(150),
    "tracking_code" VARCHAR(150),
    "status" "CourierShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shipping_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cod_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "courier_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "recipient_name" VARCHAR(150),
    "recipient_phone" VARCHAR(30),
    "delivery_address_snapshot" JSONB,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "courier_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_shipment_items" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courier_shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_receivables" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "courier_id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "cod_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "courier_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_receivable" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CourierReceivableStatus" NOT NULL DEFAULT 'PENDING',
    "expected_settlement_date" TIMESTAMP(3),
    "settled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courier_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_settlements" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "courier_id" UUID NOT NULL,
    "settlement_no" VARCHAR(100) NOT NULL,
    "settlement_date" TIMESTAMP(3) NOT NULL,
    "total_cod_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_courier_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_settlement_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CourierSettlementStatus" NOT NULL DEFAULT 'DRAFT',
    "reference_no" VARCHAR(150),
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "courier_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_settlement_items" (
    "id" UUID NOT NULL,
    "settlement_id" UUID NOT NULL,
    "receivable_id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "cod_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "courier_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "settlement_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courier_settlement_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_accounts" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "account_type" "FinanceAccountType" NOT NULL,
    "account_number" VARCHAR(100),
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "opening_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "current_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "FinanceAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "finance_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_account_transactions" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "transaction_no" VARCHAR(100) NOT NULL,
    "transaction_type" "FinanceTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balance_before" DECIMAL(12,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "reference_type" "FinanceSourceType",
    "reference_id" UUID,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_account_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expense_categories" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "status" "FinanceExpenseCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "finance_expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_expenses" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "expense_category_id" UUID NOT NULL,
    "expense_no" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "expense_date" TIMESTAMP(3) NOT NULL,
    "status" "FinanceExpenseStatus" NOT NULL DEFAULT 'DRAFT',
    "reference_no" VARCHAR(150),
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "finance_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_receivables" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "receivable_no" VARCHAR(100) NOT NULL,
    "party_type" "FinancePartyType" NOT NULL,
    "party_id" UUID,
    "source_type" "FinanceSourceType" NOT NULL,
    "source_id" UUID,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "received_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "FinanceReceivableStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payables" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "payable_no" VARCHAR(100) NOT NULL,
    "party_type" "FinancePartyType" NOT NULL,
    "party_id" UUID,
    "source_type" "FinanceSourceType" NOT NULL,
    "source_id" UUID,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "FinancePayableStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_payables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_journal_entries" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "journal_no" VARCHAR(100) NOT NULL,
    "journal_date" TIMESTAMP(3) NOT NULL,
    "reference_type" "FinanceSourceType",
    "reference_id" UUID,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_journal_entry_lines" (
    "id" UUID NOT NULL,
    "journal_entry_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "entry_type" "FinanceJournalLineType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_journal_entry_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_locations" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "location_type" "InventoryLocationType" NOT NULL,
    "phone" VARCHAR(30),
    "address" TEXT,
    "status" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "inventory_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stocks" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "total_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "quantity_reserved" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "low_stock_alert_qty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_batches" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "batch_no" VARCHAR(100) NOT NULL,
    "quantity_received" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "quantity_remaining" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_movements" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "movement_type" "InventoryMovementType" NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "reference_type" "InventoryReferenceType",
    "reference_id" UUID,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_adjustments" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "adjustment_no" VARCHAR(100) NOT NULL,
    "adjustment_type" "InventoryAdjustmentType" NOT NULL,
    "reason" TEXT,
    "status" "InventoryAdjustmentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" UUID,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "inventory_stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_adjustment_items" (
    "id" UUID NOT NULL,
    "adjustment_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "old_quantity" DECIMAL(14,3) NOT NULL,
    "adjustment_qty" DECIMAL(14,3) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stock_adjustment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_transfers" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "transfer_no" VARCHAR(100) NOT NULL,
    "from_location_id" UUID NOT NULL,
    "to_location_id" UUID NOT NULL,
    "status" "InventoryTransferStatus" NOT NULL DEFAULT 'DRAFT',
    "note" TEXT,
    "created_by" UUID,
    "approved_by" UUID,
    "shipped_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "inventory_stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock_transfer_items" (
    "id" UUID NOT NULL,
    "transfer_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "requested_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "transferred_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "received_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_invoices" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_id" UUID,
    "customer_id" UUID,
    "invoice_no" VARCHAR(100) NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "customer_name" VARCHAR(150),
    "customer_phone" VARCHAR(30),
    "customer_email" VARCHAR(150),
    "billing_address_snapshot" JSONB,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoice_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_invoice_items" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "order_item_id" UUID,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_templates" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "logo_url" TEXT,
    "header_text" TEXT,
    "footer_text" TEXT,
    "terms_and_conditions" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" "InvoiceTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "uploaded_by" UUID,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" "MediaFileType" NOT NULL,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "folder" VARCHAR(150),
    "alt_text" TEXT,
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_tags" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "MediaTagStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_asset_tags" (
    "id" UUID NOT NULL,
    "media_asset_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_asset_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" UUID NOT NULL,
    "business_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "subject" VARCHAR(255),
    "title" VARCHAR(255),
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "status" "NotificationTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "business_id" UUID,
    "recipient_type" "NotificationRecipientType" NOT NULL,
    "recipient_id" UUID NOT NULL,
    "template_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "data" JSONB,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_customers" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(30),
    "status" "OrderCustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "order_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_customer_addresses" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "address_type" "OrderAddressType" NOT NULL DEFAULT 'HOME',
    "name" VARCHAR(150),
    "address" TEXT NOT NULL,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "order_customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_carts" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "customer_id" UUID,
    "session_id" VARCHAR(150),
    "status" "OrderCartStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "order_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_cart_items" (
    "id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_orders" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "customer_id" UUID,
    "location_id" UUID,
    "order_no" VARCHAR(100) NOT NULL,
    "order_type" "OrderType" NOT NULL,
    "order_source" "OrderSource" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "OrderPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "customer_name" VARCHAR(150),
    "customer_phone" VARCHAR(30),
    "customer_email" VARCHAR(150),
    "shipping_address_snapshot" JSONB,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "order_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_logs" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "from_status" "OrderStatus",
    "to_status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "changed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discounts" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "discount_type" "OrderDiscountType" NOT NULL,
    "discount_source" "OrderDiscountSource" NOT NULL,
    "code" VARCHAR(100),
    "amount" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_payments" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "payment_no" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_method" "OrderPaymentMethod" NOT NULL,
    "payment_status" "OrderPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "transaction_reference" VARCHAR(150),
    "paid_at" TIMESTAMP(3),
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_returns" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "return_no" VARCHAR(100) NOT NULL,
    "status" "OrderReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_by" UUID,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "order_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_return_items" (
    "id" UUID NOT NULL,
    "return_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_refunds" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "return_id" UUID,
    "payment_id" UUID,
    "refund_no" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "refund_method" "OrderRefundMethod" NOT NULL,
    "refund_status" "OrderRefundStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_reference" VARCHAR(150),
    "processed_by" UUID,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_plans" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "billing_cycle" "PackageBillingCycle" NOT NULL,
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "free_trial_days" INTEGER NOT NULL DEFAULT 0,
    "status" "PackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "package_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_plan_limits" (
    "id" UUID NOT NULL,
    "package_id" UUID NOT NULL,
    "limit_key" VARCHAR(100) NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "reset_cycle" "PackageResetCycle" NOT NULL DEFAULT 'LIFETIME',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_plan_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_addons" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "billing_cycle" "PackageBillingCycle" NOT NULL,
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "status" "PackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "package_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_addon_limits" (
    "id" UUID NOT NULL,
    "addon_id" UUID NOT NULL,
    "limit_key" VARCHAR(100) NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "reset_cycle" "PackageResetCycle" NOT NULL DEFAULT 'LIFETIME',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_addon_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_subscriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "package_id" UUID NOT NULL,
    "status" "PackageSubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "billing_cycle" "PackageBillingCycle" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "started_at" TIMESTAMP(3) NOT NULL,
    "trial_ends_at" TIMESTAMP(3),
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "end_reason" TEXT,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_subscription_addons" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "addon_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" "PackageSubscriptionAddonStatus" NOT NULL DEFAULT 'ACTIVE',
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_subscription_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_usage_counters" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "limit_key" VARCHAR(100) NOT NULL,
    "used_value" INTEGER NOT NULL DEFAULT 0,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_usage_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_gateways" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "PaymentGatewayStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_gateway_configs" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "gateway_id" UUID NOT NULL,
    "config_data" JSONB NOT NULL,
    "mode" "PaymentGatewayMode" NOT NULL DEFAULT 'SANDBOX',
    "status" "PaymentGatewayConfigStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_gateway_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "gateway_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "payment_type" "PaymentMethodType" NOT NULL,
    "status" "PaymentMethodStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_webhook_events" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "gateway_id" UUID NOT NULL,
    "order_payment_id" UUID,
    "event_type" VARCHAR(100) NOT NULL,
    "event_id" VARCHAR(150),
    "payload" JSONB NOT NULL,
    "status" "PaymentWebhookStatus" NOT NULL DEFAULT 'PENDING',
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "status" "ProductSimpleStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_brands" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "status" "ProductSimpleStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_units" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ProductSimpleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ProductSimpleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_products" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "category_id" UUID,
    "brand_id" UUID,
    "unit_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "has_variants" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CatalogProductStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "title" VARCHAR(200) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "weight" DECIMAL(10,2),
    "status" "ProductVariantStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ProductSimpleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_attributes" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "attribute_value_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "image_url" TEXT NOT NULL,
    "alt_text" TEXT,
    "is_thumbnail" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tag_map" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_tag_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rbac_roles" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "rbac_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rbac_role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "feature" "RbacFeature" NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "rbac_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rbac_user_role_map" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "status" "UserRoleMapStatus" NOT NULL DEFAULT 'ACTIVE',
    "assigned_by" UUID,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "rbac_user_role_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_providers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "SmsProviderStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_provider_configs" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "config_data" JSONB NOT NULL,
    "mode" "SmsProviderConfigMode" NOT NULL DEFAULT 'SANDBOX',
    "status" "SmsProviderConfigStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sms_provider_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_templates" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "template_type" "SmsTemplateType" NOT NULL,
    "message_body" TEXT NOT NULL,
    "variables" JSONB,
    "status" "SmsTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sms_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_campaigns" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "template_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "message_body" TEXT NOT NULL,
    "campaign_type" "SmsCampaignType" NOT NULL,
    "status" "SmsCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "total_recipients" INTEGER NOT NULL DEFAULT 0,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sms_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_campaign_recipients" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "customer_id" UUID,
    "recipient_name" VARCHAR(150),
    "phone" VARCHAR(30) NOT NULL,
    "status" "SmsRecipientStatus" NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "campaign_id" UUID,
    "recipient_id" UUID,
    "provider_id" UUID,
    "phone" VARCHAR(30) NOT NULL,
    "message_body" TEXT NOT NULL,
    "sms_count" INTEGER NOT NULL DEFAULT 1,
    "status" "SmsLogStatus" NOT NULL DEFAULT 'PENDING',
    "provider_message_id" VARCHAR(150),
    "provider_response" JSONB,
    "sent_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_suppliers" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "company_name" VARCHAR(150),
    "email" VARCHAR(150),
    "phone" VARCHAR(30),
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "status" "SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supplier_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_product_map" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "supplier_sku" VARCHAR(100),
    "last_purchase_price" DECIMAL(12,2),
    "min_order_quantity" DECIMAL(14,3),
    "lead_time_days" INTEGER,
    "status" "SupplierProductMapStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_product_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_purchase_orders" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "purchase_order_no" VARCHAR(100) NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "expected_delivery_date" TIMESTAMP(3),
    "status" "SupplierPurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_by" UUID,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supplier_purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_purchase_order_items" (
    "id" UUID NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity_ordered" DECIMAL(14,3) NOT NULL,
    "quantity_received" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_invoices" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "purchase_order_id" UUID,
    "invoice_no" VARCHAR(100) NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" "SupplierInvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supplier_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_invoice_items" (
    "id" UUID NOT NULL,
    "supplier_invoice_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_payments" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "supplier_invoice_id" UUID NOT NULL,
    "payment_no" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_method" "SupplierPaymentMethod" NOT NULL,
    "reference_no" VARCHAR(150),
    "note" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supplier_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_purchase_returns" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "purchase_order_id" UUID,
    "supplier_invoice_id" UUID,
    "location_id" UUID NOT NULL,
    "return_no" VARCHAR(100) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "status" "SupplierPurchaseReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_purchase_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_purchase_return_items" (
    "id" UUID NOT NULL,
    "purchase_return_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_purchase_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "password_hash" TEXT NOT NULL,
    "type" "SystemUserType" NOT NULL,
    "status" "SystemUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMPTZ(6),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "image_url" TEXT,
    "date_of_birth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "bio" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "system_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_email_verifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_password_resets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_id" UUID,
    "refresh_token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "system_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "business_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "feature" VARCHAR(100) NOT NULL,
    "entity_name" VARCHAR(150) NOT NULL,
    "entity_id" VARCHAR(100),
    "old_data" JSONB,
    "new_data" JSONB,
    "ip_address" VARCHAR(100),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_templates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "category" VARCHAR(100),
    "thumbnail_url" TEXT,
    "preview_url" TEXT,
    "config_schema" JSONB,
    "status" "WebsiteTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_websites" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "template_id" UUID,
    "current_version_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_configs" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "header_config" JSONB,
    "footer_config" JSONB,
    "navigation_config" JSONB,
    "general_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_domains" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "domain" VARCHAR(255),
    "subdomain" VARCHAR(255),
    "domain_type" "WebsiteDomainType" NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" "WebsiteDomainVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "ssl_status" "WebsiteDomainSslStatus" NOT NULL DEFAULT 'PENDING',
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_pages" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "page_type" "WebsitePageType" NOT NULL DEFAULT 'CUSTOM',
    "status" "WebsitePageStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_homepage" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_page_sections" (
    "id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "component_id" UUID,
    "name" VARCHAR(150),
    "section_key" VARCHAR(120) NOT NULL,
    "content_config" JSONB,
    "style_config" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "WebsiteSectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_components" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "component_type" VARCHAR(100) NOT NULL,
    "preview_image_url" TEXT,
    "default_config" JSONB,
    "status" "WebsiteComponentStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_theme_settings" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "primary_color" VARCHAR(30),
    "secondary_color" VARCHAR(30),
    "accent_color" VARCHAR(30),
    "font_family" VARCHAR(100),
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "custom_css" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_seo_settings" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "page_id" UUID,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_title" VARCHAR(255),
    "og_description" TEXT,
    "og_image_url" TEXT,
    "canonical_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_seo_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_publish_versions" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "version_no" INTEGER NOT NULL,
    "snapshot_data" JSONB NOT NULL,
    "published_by" UUID,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_publish_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_businesses_owner_user_id_idx" ON "business_businesses"("owner_user_id");

-- CreateIndex
CREATE INDEX "business_businesses_status_idx" ON "business_businesses"("status");

-- CreateIndex
CREATE INDEX "business_businesses_deleted_at_idx" ON "business_businesses"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "business_businesses_slug_owner_user_id_key" ON "business_businesses"("slug", "owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_settings_business_id_key" ON "business_settings"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_branding_business_id_key" ON "business_branding"("business_id");

-- CreateIndex
CREATE INDEX "business_members_business_id_idx" ON "business_members"("business_id");

-- CreateIndex
CREATE INDEX "business_members_user_id_idx" ON "business_members"("user_id");

-- CreateIndex
CREATE INDEX "business_members_status_idx" ON "business_members"("status");

-- CreateIndex
CREATE INDEX "business_members_deleted_at_idx" ON "business_members"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "business_members_business_id_user_id_key" ON "business_members"("business_id", "user_id");

-- CreateIndex
CREATE INDEX "courier_couriers_status_idx" ON "courier_couriers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "courier_couriers_name_key" ON "courier_couriers"("name");

-- CreateIndex
CREATE INDEX "courier_configs_business_id_idx" ON "courier_configs"("business_id");

-- CreateIndex
CREATE INDEX "courier_configs_courier_id_idx" ON "courier_configs"("courier_id");

-- CreateIndex
CREATE INDEX "courier_configs_status_idx" ON "courier_configs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "courier_configs_business_id_courier_id_mode_key" ON "courier_configs"("business_id", "courier_id", "mode");

-- CreateIndex
CREATE INDEX "courier_delivery_zones_business_id_idx" ON "courier_delivery_zones"("business_id");

-- CreateIndex
CREATE INDEX "courier_delivery_zones_status_idx" ON "courier_delivery_zones"("status");

-- CreateIndex
CREATE UNIQUE INDEX "courier_delivery_zones_business_id_name_key" ON "courier_delivery_zones"("business_id", "name");

-- CreateIndex
CREATE INDEX "courier_delivery_zone_areas_delivery_zone_id_idx" ON "courier_delivery_zone_areas"("delivery_zone_id");

-- CreateIndex
CREATE INDEX "courier_delivery_zone_areas_city_idx" ON "courier_delivery_zone_areas"("city");

-- CreateIndex
CREATE INDEX "courier_shipping_charges_business_id_idx" ON "courier_shipping_charges"("business_id");

-- CreateIndex
CREATE INDEX "courier_shipping_charges_delivery_zone_id_idx" ON "courier_shipping_charges"("delivery_zone_id");

-- CreateIndex
CREATE INDEX "courier_shipping_charges_courier_id_idx" ON "courier_shipping_charges"("courier_id");

-- CreateIndex
CREATE INDEX "courier_shipping_charges_status_idx" ON "courier_shipping_charges"("status");

-- CreateIndex
CREATE INDEX "courier_shipments_business_id_idx" ON "courier_shipments"("business_id");

-- CreateIndex
CREATE INDEX "courier_shipments_order_id_idx" ON "courier_shipments"("order_id");

-- CreateIndex
CREATE INDEX "courier_shipments_courier_id_idx" ON "courier_shipments"("courier_id");

-- CreateIndex
CREATE INDEX "courier_shipments_delivery_zone_id_idx" ON "courier_shipments"("delivery_zone_id");

-- CreateIndex
CREATE INDEX "courier_shipments_status_idx" ON "courier_shipments"("status");

-- CreateIndex
CREATE INDEX "courier_shipments_tracking_code_idx" ON "courier_shipments"("tracking_code");

-- CreateIndex
CREATE UNIQUE INDEX "courier_shipments_business_id_shipment_no_key" ON "courier_shipments"("business_id", "shipment_no");

-- CreateIndex
CREATE UNIQUE INDEX "courier_shipments_consignment_id_key" ON "courier_shipments"("consignment_id");

-- CreateIndex
CREATE INDEX "courier_shipment_items_shipment_id_idx" ON "courier_shipment_items"("shipment_id");

-- CreateIndex
CREATE INDEX "courier_shipment_items_order_item_id_idx" ON "courier_shipment_items"("order_item_id");

-- CreateIndex
CREATE INDEX "courier_shipment_items_product_id_idx" ON "courier_shipment_items"("product_id");

-- CreateIndex
CREATE INDEX "courier_shipment_items_variant_id_idx" ON "courier_shipment_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "courier_receivables_shipment_id_key" ON "courier_receivables"("shipment_id");

-- CreateIndex
CREATE INDEX "courier_receivables_business_id_idx" ON "courier_receivables"("business_id");

-- CreateIndex
CREATE INDEX "courier_receivables_courier_id_idx" ON "courier_receivables"("courier_id");

-- CreateIndex
CREATE INDEX "courier_receivables_order_id_idx" ON "courier_receivables"("order_id");

-- CreateIndex
CREATE INDEX "courier_receivables_status_idx" ON "courier_receivables"("status");

-- CreateIndex
CREATE INDEX "courier_receivables_expected_settlement_date_idx" ON "courier_receivables"("expected_settlement_date");

-- CreateIndex
CREATE INDEX "courier_settlements_business_id_idx" ON "courier_settlements"("business_id");

-- CreateIndex
CREATE INDEX "courier_settlements_courier_id_idx" ON "courier_settlements"("courier_id");

-- CreateIndex
CREATE INDEX "courier_settlements_settlement_date_idx" ON "courier_settlements"("settlement_date");

-- CreateIndex
CREATE INDEX "courier_settlements_status_idx" ON "courier_settlements"("status");

-- CreateIndex
CREATE UNIQUE INDEX "courier_settlements_business_id_settlement_no_key" ON "courier_settlements"("business_id", "settlement_no");

-- CreateIndex
CREATE INDEX "courier_settlement_items_settlement_id_idx" ON "courier_settlement_items"("settlement_id");

-- CreateIndex
CREATE INDEX "courier_settlement_items_shipment_id_idx" ON "courier_settlement_items"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "courier_settlement_items_receivable_id_key" ON "courier_settlement_items"("receivable_id");

-- CreateIndex
CREATE INDEX "finance_accounts_business_id_idx" ON "finance_accounts"("business_id");

-- CreateIndex
CREATE INDEX "finance_accounts_account_type_idx" ON "finance_accounts"("account_type");

-- CreateIndex
CREATE INDEX "finance_accounts_status_idx" ON "finance_accounts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_accounts_business_id_name_key" ON "finance_accounts"("business_id", "name");

-- CreateIndex
CREATE INDEX "finance_account_transactions_business_id_idx" ON "finance_account_transactions"("business_id");

-- CreateIndex
CREATE INDEX "finance_account_transactions_account_id_idx" ON "finance_account_transactions"("account_id");

-- CreateIndex
CREATE INDEX "finance_account_transactions_transaction_type_idx" ON "finance_account_transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "finance_account_transactions_reference_type_reference_id_idx" ON "finance_account_transactions"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "finance_account_transactions_created_at_idx" ON "finance_account_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "finance_account_transactions_business_id_transaction_no_key" ON "finance_account_transactions"("business_id", "transaction_no");

-- CreateIndex
CREATE INDEX "finance_expense_categories_business_id_idx" ON "finance_expense_categories"("business_id");

-- CreateIndex
CREATE INDEX "finance_expense_categories_status_idx" ON "finance_expense_categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "finance_expense_categories_business_id_name_key" ON "finance_expense_categories"("business_id", "name");

-- CreateIndex
CREATE INDEX "finance_expenses_business_id_idx" ON "finance_expenses"("business_id");

-- CreateIndex
CREATE INDEX "finance_expenses_account_id_idx" ON "finance_expenses"("account_id");

-- CreateIndex
CREATE INDEX "finance_expenses_expense_category_id_idx" ON "finance_expenses"("expense_category_id");

-- CreateIndex
CREATE INDEX "finance_expenses_status_idx" ON "finance_expenses"("status");

-- CreateIndex
CREATE INDEX "finance_expenses_expense_date_idx" ON "finance_expenses"("expense_date");

-- CreateIndex
CREATE UNIQUE INDEX "finance_expenses_business_id_expense_no_key" ON "finance_expenses"("business_id", "expense_no");

-- CreateIndex
CREATE INDEX "finance_receivables_business_id_idx" ON "finance_receivables"("business_id");

-- CreateIndex
CREATE INDEX "finance_receivables_party_type_party_id_idx" ON "finance_receivables"("party_type", "party_id");

-- CreateIndex
CREATE INDEX "finance_receivables_source_type_source_id_idx" ON "finance_receivables"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "finance_receivables_status_idx" ON "finance_receivables"("status");

-- CreateIndex
CREATE INDEX "finance_receivables_due_date_idx" ON "finance_receivables"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "finance_receivables_business_id_receivable_no_key" ON "finance_receivables"("business_id", "receivable_no");

-- CreateIndex
CREATE INDEX "finance_payables_business_id_idx" ON "finance_payables"("business_id");

-- CreateIndex
CREATE INDEX "finance_payables_party_type_party_id_idx" ON "finance_payables"("party_type", "party_id");

-- CreateIndex
CREATE INDEX "finance_payables_source_type_source_id_idx" ON "finance_payables"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "finance_payables_status_idx" ON "finance_payables"("status");

-- CreateIndex
CREATE INDEX "finance_payables_due_date_idx" ON "finance_payables"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "finance_payables_business_id_payable_no_key" ON "finance_payables"("business_id", "payable_no");

-- CreateIndex
CREATE INDEX "finance_journal_entries_business_id_idx" ON "finance_journal_entries"("business_id");

-- CreateIndex
CREATE INDEX "finance_journal_entries_journal_date_idx" ON "finance_journal_entries"("journal_date");

-- CreateIndex
CREATE INDEX "finance_journal_entries_reference_type_reference_id_idx" ON "finance_journal_entries"("reference_type", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "finance_journal_entries_business_id_journal_no_key" ON "finance_journal_entries"("business_id", "journal_no");

-- CreateIndex
CREATE INDEX "finance_journal_entry_lines_journal_entry_id_idx" ON "finance_journal_entry_lines"("journal_entry_id");

-- CreateIndex
CREATE INDEX "finance_journal_entry_lines_account_id_idx" ON "finance_journal_entry_lines"("account_id");

-- CreateIndex
CREATE INDEX "finance_journal_entry_lines_entry_type_idx" ON "finance_journal_entry_lines"("entry_type");

-- CreateIndex
CREATE INDEX "inventory_locations_business_id_idx" ON "inventory_locations"("business_id");

-- CreateIndex
CREATE INDEX "inventory_locations_location_type_idx" ON "inventory_locations"("location_type");

-- CreateIndex
CREATE INDEX "inventory_locations_status_idx" ON "inventory_locations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_locations_business_id_name_key" ON "inventory_locations"("business_id", "name");

-- CreateIndex
CREATE INDEX "inventory_stocks_business_id_idx" ON "inventory_stocks"("business_id");

-- CreateIndex
CREATE INDEX "inventory_stocks_location_id_idx" ON "inventory_stocks"("location_id");

-- CreateIndex
CREATE INDEX "inventory_stocks_product_id_idx" ON "inventory_stocks"("product_id");

-- CreateIndex
CREATE INDEX "inventory_stocks_variant_id_idx" ON "inventory_stocks"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_business_id_idx" ON "inventory_stock_batches"("business_id");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_location_id_idx" ON "inventory_stock_batches"("location_id");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_product_id_idx" ON "inventory_stock_batches"("product_id");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_variant_id_idx" ON "inventory_stock_batches"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_batch_no_idx" ON "inventory_stock_batches"("batch_no");

-- CreateIndex
CREATE INDEX "inventory_stock_batches_expiry_date_idx" ON "inventory_stock_batches"("expiry_date");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_business_id_idx" ON "inventory_stock_movements"("business_id");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_location_id_idx" ON "inventory_stock_movements"("location_id");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_product_id_idx" ON "inventory_stock_movements"("product_id");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_variant_id_idx" ON "inventory_stock_movements"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_movement_type_idx" ON "inventory_stock_movements"("movement_type");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_reference_type_reference_id_idx" ON "inventory_stock_movements"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "inventory_stock_movements_created_at_idx" ON "inventory_stock_movements"("created_at");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustments_business_id_idx" ON "inventory_stock_adjustments"("business_id");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustments_location_id_idx" ON "inventory_stock_adjustments"("location_id");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustments_adjustment_type_idx" ON "inventory_stock_adjustments"("adjustment_type");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustments_status_idx" ON "inventory_stock_adjustments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_adjustments_business_id_adjustment_no_key" ON "inventory_stock_adjustments"("business_id", "adjustment_no");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustment_items_adjustment_id_idx" ON "inventory_stock_adjustment_items"("adjustment_id");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustment_items_product_id_idx" ON "inventory_stock_adjustment_items"("product_id");

-- CreateIndex
CREATE INDEX "inventory_stock_adjustment_items_variant_id_idx" ON "inventory_stock_adjustment_items"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfers_business_id_idx" ON "inventory_stock_transfers"("business_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfers_from_location_id_idx" ON "inventory_stock_transfers"("from_location_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfers_to_location_id_idx" ON "inventory_stock_transfers"("to_location_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfers_status_idx" ON "inventory_stock_transfers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_transfers_business_id_transfer_no_key" ON "inventory_stock_transfers"("business_id", "transfer_no");

-- CreateIndex
CREATE INDEX "inventory_stock_transfer_items_transfer_id_idx" ON "inventory_stock_transfer_items"("transfer_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfer_items_product_id_idx" ON "inventory_stock_transfer_items"("product_id");

-- CreateIndex
CREATE INDEX "inventory_stock_transfer_items_variant_id_idx" ON "inventory_stock_transfer_items"("variant_id");

-- CreateIndex
CREATE INDEX "invoice_invoices_business_id_idx" ON "invoice_invoices"("business_id");

-- CreateIndex
CREATE INDEX "invoice_invoices_order_id_idx" ON "invoice_invoices"("order_id");

-- CreateIndex
CREATE INDEX "invoice_invoices_customer_id_idx" ON "invoice_invoices"("customer_id");

-- CreateIndex
CREATE INDEX "invoice_invoices_status_idx" ON "invoice_invoices"("status");

-- CreateIndex
CREATE INDEX "invoice_invoices_invoice_date_idx" ON "invoice_invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "invoice_invoices_due_date_idx" ON "invoice_invoices"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoices_business_id_invoice_no_key" ON "invoice_invoices"("business_id", "invoice_no");

-- CreateIndex
CREATE INDEX "invoice_invoice_items_invoice_id_idx" ON "invoice_invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_invoice_items_order_item_id_idx" ON "invoice_invoice_items"("order_item_id");

-- CreateIndex
CREATE INDEX "invoice_invoice_items_product_id_idx" ON "invoice_invoice_items"("product_id");

-- CreateIndex
CREATE INDEX "invoice_invoice_items_variant_id_idx" ON "invoice_invoice_items"("variant_id");

-- CreateIndex
CREATE INDEX "invoice_templates_business_id_idx" ON "invoice_templates"("business_id");

-- CreateIndex
CREATE INDEX "invoice_templates_is_default_idx" ON "invoice_templates"("is_default");

-- CreateIndex
CREATE INDEX "invoice_templates_status_idx" ON "invoice_templates"("status");

-- CreateIndex
CREATE INDEX "media_assets_business_id_idx" ON "media_assets"("business_id");

-- CreateIndex
CREATE INDEX "media_assets_uploaded_by_idx" ON "media_assets"("uploaded_by");

-- CreateIndex
CREATE INDEX "media_assets_file_type_idx" ON "media_assets"("file_type");

-- CreateIndex
CREATE INDEX "media_assets_folder_idx" ON "media_assets"("folder");

-- CreateIndex
CREATE INDEX "media_assets_status_idx" ON "media_assets"("status");

-- CreateIndex
CREATE INDEX "media_tags_business_id_idx" ON "media_tags"("business_id");

-- CreateIndex
CREATE INDEX "media_tags_status_idx" ON "media_tags"("status");

-- CreateIndex
CREATE UNIQUE INDEX "media_tags_business_id_name_key" ON "media_tags"("business_id", "name");

-- CreateIndex
CREATE INDEX "media_asset_tags_media_asset_id_idx" ON "media_asset_tags"("media_asset_id");

-- CreateIndex
CREATE INDEX "media_asset_tags_tag_id_idx" ON "media_asset_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_asset_tags_media_asset_id_tag_id_key" ON "media_asset_tags"("media_asset_id", "tag_id");

-- CreateIndex
CREATE INDEX "notification_templates_business_id_idx" ON "notification_templates"("business_id");

-- CreateIndex
CREATE INDEX "notification_templates_code_idx" ON "notification_templates"("code");

-- CreateIndex
CREATE INDEX "notification_templates_channel_idx" ON "notification_templates"("channel");

-- CreateIndex
CREATE INDEX "notification_templates_status_idx" ON "notification_templates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_business_id_code_channel_key" ON "notification_templates"("business_id", "code", "channel");

-- CreateIndex
CREATE INDEX "notifications_business_id_idx" ON "notifications"("business_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_type_recipient_id_idx" ON "notifications"("recipient_type", "recipient_id");

-- CreateIndex
CREATE INDEX "notifications_template_id_idx" ON "notifications"("template_id");

-- CreateIndex
CREATE INDEX "notifications_channel_idx" ON "notifications"("channel");

-- CreateIndex
CREATE INDEX "notifications_notification_type_idx" ON "notifications"("notification_type");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_read_at_idx" ON "notifications"("read_at");

-- CreateIndex
CREATE INDEX "notifications_sent_at_idx" ON "notifications"("sent_at");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "order_customers_business_id_idx" ON "order_customers"("business_id");

-- CreateIndex
CREATE INDEX "order_customers_phone_idx" ON "order_customers"("phone");

-- CreateIndex
CREATE INDEX "order_customers_email_idx" ON "order_customers"("email");

-- CreateIndex
CREATE INDEX "order_customers_status_idx" ON "order_customers"("status");

-- CreateIndex
CREATE INDEX "order_customer_addresses_customer_id_idx" ON "order_customer_addresses"("customer_id");

-- CreateIndex
CREATE INDEX "order_customer_addresses_address_type_idx" ON "order_customer_addresses"("address_type");

-- CreateIndex
CREATE INDEX "order_customer_addresses_is_default_idx" ON "order_customer_addresses"("is_default");

-- CreateIndex
CREATE INDEX "order_carts_business_id_idx" ON "order_carts"("business_id");

-- CreateIndex
CREATE INDEX "order_carts_customer_id_idx" ON "order_carts"("customer_id");

-- CreateIndex
CREATE INDEX "order_carts_session_id_idx" ON "order_carts"("session_id");

-- CreateIndex
CREATE INDEX "order_carts_status_idx" ON "order_carts"("status");

-- CreateIndex
CREATE INDEX "order_cart_items_cart_id_idx" ON "order_cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "order_cart_items_product_id_idx" ON "order_cart_items"("product_id");

-- CreateIndex
CREATE INDEX "order_cart_items_variant_id_idx" ON "order_cart_items"("variant_id");

-- CreateIndex
CREATE INDEX "order_orders_business_id_idx" ON "order_orders"("business_id");

-- CreateIndex
CREATE INDEX "order_orders_customer_id_idx" ON "order_orders"("customer_id");

-- CreateIndex
CREATE INDEX "order_orders_location_id_idx" ON "order_orders"("location_id");

-- CreateIndex
CREATE INDEX "order_orders_status_idx" ON "order_orders"("status");

-- CreateIndex
CREATE INDEX "order_orders_payment_status_idx" ON "order_orders"("payment_status");

-- CreateIndex
CREATE INDEX "order_orders_created_at_idx" ON "order_orders"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "order_orders_business_id_order_no_key" ON "order_orders"("business_id", "order_no");

-- CreateIndex
CREATE INDEX "order_order_items_order_id_idx" ON "order_order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_order_items_product_id_idx" ON "order_order_items"("product_id");

-- CreateIndex
CREATE INDEX "order_order_items_variant_id_idx" ON "order_order_items"("variant_id");

-- CreateIndex
CREATE INDEX "order_status_logs_order_id_idx" ON "order_status_logs"("order_id");

-- CreateIndex
CREATE INDEX "order_status_logs_to_status_idx" ON "order_status_logs"("to_status");

-- CreateIndex
CREATE INDEX "order_status_logs_created_at_idx" ON "order_status_logs"("created_at");

-- CreateIndex
CREATE INDEX "order_discounts_order_id_idx" ON "order_discounts"("order_id");

-- CreateIndex
CREATE INDEX "order_discounts_code_idx" ON "order_discounts"("code");

-- CreateIndex
CREATE INDEX "order_payments_business_id_idx" ON "order_payments"("business_id");

-- CreateIndex
CREATE INDEX "order_payments_order_id_idx" ON "order_payments"("order_id");

-- CreateIndex
CREATE INDEX "order_payments_payment_method_idx" ON "order_payments"("payment_method");

-- CreateIndex
CREATE INDEX "order_payments_payment_status_idx" ON "order_payments"("payment_status");

-- CreateIndex
CREATE INDEX "order_payments_paid_at_idx" ON "order_payments"("paid_at");

-- CreateIndex
CREATE UNIQUE INDEX "order_payments_business_id_payment_no_key" ON "order_payments"("business_id", "payment_no");

-- CreateIndex
CREATE INDEX "order_returns_business_id_idx" ON "order_returns"("business_id");

-- CreateIndex
CREATE INDEX "order_returns_order_id_idx" ON "order_returns"("order_id");

-- CreateIndex
CREATE INDEX "order_returns_status_idx" ON "order_returns"("status");

-- CreateIndex
CREATE UNIQUE INDEX "order_returns_business_id_return_no_key" ON "order_returns"("business_id", "return_no");

-- CreateIndex
CREATE INDEX "order_return_items_return_id_idx" ON "order_return_items"("return_id");

-- CreateIndex
CREATE INDEX "order_return_items_order_item_id_idx" ON "order_return_items"("order_item_id");

-- CreateIndex
CREATE INDEX "order_return_items_product_id_idx" ON "order_return_items"("product_id");

-- CreateIndex
CREATE INDEX "order_return_items_variant_id_idx" ON "order_return_items"("variant_id");

-- CreateIndex
CREATE INDEX "order_refunds_business_id_idx" ON "order_refunds"("business_id");

-- CreateIndex
CREATE INDEX "order_refunds_order_id_idx" ON "order_refunds"("order_id");

-- CreateIndex
CREATE INDEX "order_refunds_return_id_idx" ON "order_refunds"("return_id");

-- CreateIndex
CREATE INDEX "order_refunds_payment_id_idx" ON "order_refunds"("payment_id");

-- CreateIndex
CREATE INDEX "order_refunds_refund_status_idx" ON "order_refunds"("refund_status");

-- CreateIndex
CREATE UNIQUE INDEX "order_refunds_business_id_refund_no_key" ON "order_refunds"("business_id", "refund_no");

-- CreateIndex
CREATE INDEX "package_plans_status_idx" ON "package_plans"("status");

-- CreateIndex
CREATE UNIQUE INDEX "package_plans_name_key" ON "package_plans"("name");

-- CreateIndex
CREATE INDEX "package_plan_limits_limit_key_idx" ON "package_plan_limits"("limit_key");

-- CreateIndex
CREATE UNIQUE INDEX "package_plan_limits_package_id_limit_key_key" ON "package_plan_limits"("package_id", "limit_key");

-- CreateIndex
CREATE INDEX "package_addons_status_idx" ON "package_addons"("status");

-- CreateIndex
CREATE UNIQUE INDEX "package_addons_name_key" ON "package_addons"("name");

-- CreateIndex
CREATE INDEX "package_addon_limits_limit_key_idx" ON "package_addon_limits"("limit_key");

-- CreateIndex
CREATE UNIQUE INDEX "package_addon_limits_addon_id_limit_key_key" ON "package_addon_limits"("addon_id", "limit_key");

-- CreateIndex
CREATE INDEX "package_subscriptions_tenant_id_idx" ON "package_subscriptions"("tenant_id");

-- CreateIndex
CREATE INDEX "package_subscriptions_package_id_idx" ON "package_subscriptions"("package_id");

-- CreateIndex
CREATE INDEX "package_subscriptions_status_idx" ON "package_subscriptions"("status");

-- CreateIndex
CREATE INDEX "package_subscriptions_current_period_end_idx" ON "package_subscriptions"("current_period_end");

-- CreateIndex
CREATE INDEX "package_subscription_addons_addon_id_idx" ON "package_subscription_addons"("addon_id");

-- CreateIndex
CREATE INDEX "package_subscription_addons_status_idx" ON "package_subscription_addons"("status");

-- CreateIndex
CREATE UNIQUE INDEX "package_subscription_addons_subscription_id_addon_id_key" ON "package_subscription_addons"("subscription_id", "addon_id");

-- CreateIndex
CREATE INDEX "package_usage_counters_limit_key_idx" ON "package_usage_counters"("limit_key");

-- CreateIndex
CREATE INDEX "package_usage_counters_period_start_period_end_idx" ON "package_usage_counters"("period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "package_usage_counters_subscription_id_limit_key_period_sta_key" ON "package_usage_counters"("subscription_id", "limit_key", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "payment_gateways_status_idx" ON "payment_gateways"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_gateways_code_key" ON "payment_gateways"("code");

-- CreateIndex
CREATE INDEX "payment_gateway_configs_business_id_idx" ON "payment_gateway_configs"("business_id");

-- CreateIndex
CREATE INDEX "payment_gateway_configs_gateway_id_idx" ON "payment_gateway_configs"("gateway_id");

-- CreateIndex
CREATE INDEX "payment_gateway_configs_status_idx" ON "payment_gateway_configs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_gateway_configs_business_id_gateway_id_mode_key" ON "payment_gateway_configs"("business_id", "gateway_id", "mode");

-- CreateIndex
CREATE INDEX "payment_methods_business_id_idx" ON "payment_methods"("business_id");

-- CreateIndex
CREATE INDEX "payment_methods_gateway_id_idx" ON "payment_methods"("gateway_id");

-- CreateIndex
CREATE INDEX "payment_methods_payment_type_idx" ON "payment_methods"("payment_type");

-- CreateIndex
CREATE INDEX "payment_methods_status_idx" ON "payment_methods"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_business_id_code_key" ON "payment_methods"("business_id", "code");

-- CreateIndex
CREATE INDEX "payment_webhook_events_business_id_idx" ON "payment_webhook_events"("business_id");

-- CreateIndex
CREATE INDEX "payment_webhook_events_gateway_id_idx" ON "payment_webhook_events"("gateway_id");

-- CreateIndex
CREATE INDEX "payment_webhook_events_order_payment_id_idx" ON "payment_webhook_events"("order_payment_id");

-- CreateIndex
CREATE INDEX "payment_webhook_events_event_type_idx" ON "payment_webhook_events"("event_type");

-- CreateIndex
CREATE INDEX "payment_webhook_events_event_id_idx" ON "payment_webhook_events"("event_id");

-- CreateIndex
CREATE INDEX "payment_webhook_events_status_idx" ON "payment_webhook_events"("status");

-- CreateIndex
CREATE INDEX "payment_webhook_events_created_at_idx" ON "payment_webhook_events"("created_at");

-- CreateIndex
CREATE INDEX "product_categories_business_id_idx" ON "product_categories"("business_id");

-- CreateIndex
CREATE INDEX "product_categories_parent_id_idx" ON "product_categories"("parent_id");

-- CreateIndex
CREATE INDEX "product_categories_status_idx" ON "product_categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_business_id_name_key" ON "product_categories"("business_id", "name");

-- CreateIndex
CREATE INDEX "product_brands_business_id_idx" ON "product_brands"("business_id");

-- CreateIndex
CREATE INDEX "product_brands_status_idx" ON "product_brands"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_brands_business_id_name_key" ON "product_brands"("business_id", "name");

-- CreateIndex
CREATE INDEX "product_units_business_id_idx" ON "product_units"("business_id");

-- CreateIndex
CREATE INDEX "product_units_status_idx" ON "product_units"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_units_business_id_name_key" ON "product_units"("business_id", "name");

-- CreateIndex
CREATE INDEX "product_tags_business_id_idx" ON "product_tags"("business_id");

-- CreateIndex
CREATE INDEX "product_tags_status_idx" ON "product_tags"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_business_id_name_key" ON "product_tags"("business_id", "name");

-- CreateIndex
CREATE INDEX "product_products_business_id_idx" ON "product_products"("business_id");

-- CreateIndex
CREATE INDEX "product_products_category_id_idx" ON "product_products"("category_id");

-- CreateIndex
CREATE INDEX "product_products_brand_id_idx" ON "product_products"("brand_id");

-- CreateIndex
CREATE INDEX "product_products_unit_id_idx" ON "product_products"("unit_id");

-- CreateIndex
CREATE INDEX "product_products_status_idx" ON "product_products"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_products_business_id_slug_key" ON "product_products"("business_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_products_business_id_sku_key" ON "product_products"("business_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_products_business_id_barcode_key" ON "product_products"("business_id", "barcode");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE INDEX "product_variants_status_idx" ON "product_variants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_sku_key" ON "product_variants"("product_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_barcode_key" ON "product_variants"("product_id", "barcode");

-- CreateIndex
CREATE INDEX "product_attributes_product_id_idx" ON "product_attributes"("product_id");

-- CreateIndex
CREATE INDEX "product_attributes_status_idx" ON "product_attributes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_product_id_name_key" ON "product_attributes"("product_id", "name");

-- CreateIndex
CREATE INDEX "product_attribute_values_attribute_id_idx" ON "product_attribute_values"("attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_attribute_id_name_key" ON "product_attribute_values"("attribute_id", "name");

-- CreateIndex
CREATE INDEX "product_variant_attributes_attribute_id_idx" ON "product_variant_attributes"("attribute_id");

-- CreateIndex
CREATE INDEX "product_variant_attributes_attribute_value_id_idx" ON "product_variant_attributes"("attribute_value_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_attributes_variant_id_attribute_id_key" ON "product_variant_attributes"("variant_id", "attribute_id");

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "product_images_variant_id_idx" ON "product_images"("variant_id");

-- CreateIndex
CREATE INDEX "product_images_is_thumbnail_idx" ON "product_images"("is_thumbnail");

-- CreateIndex
CREATE INDEX "product_tag_map_tag_id_idx" ON "product_tag_map"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_tag_map_product_id_tag_id_key" ON "product_tag_map"("product_id", "tag_id");

-- CreateIndex
CREATE INDEX "rbac_roles_business_id_idx" ON "rbac_roles"("business_id");

-- CreateIndex
CREATE INDEX "rbac_roles_status_idx" ON "rbac_roles"("status");

-- CreateIndex
CREATE INDEX "rbac_roles_deleted_at_idx" ON "rbac_roles"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "rbac_roles_business_id_name_key" ON "rbac_roles"("business_id", "name");

-- CreateIndex
CREATE INDEX "rbac_role_permissions_role_id_idx" ON "rbac_role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "rbac_role_permissions_feature_idx" ON "rbac_role_permissions"("feature");

-- CreateIndex
CREATE INDEX "rbac_role_permissions_action_idx" ON "rbac_role_permissions"("action");

-- CreateIndex
CREATE UNIQUE INDEX "rbac_role_permissions_role_id_feature_action_key" ON "rbac_role_permissions"("role_id", "feature", "action");

-- CreateIndex
CREATE INDEX "rbac_user_role_map_user_id_idx" ON "rbac_user_role_map"("user_id");

-- CreateIndex
CREATE INDEX "rbac_user_role_map_role_id_idx" ON "rbac_user_role_map"("role_id");

-- CreateIndex
CREATE INDEX "rbac_user_role_map_status_idx" ON "rbac_user_role_map"("status");

-- CreateIndex
CREATE INDEX "rbac_user_role_map_expires_at_idx" ON "rbac_user_role_map"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "rbac_user_role_map_user_id_role_id_key" ON "rbac_user_role_map"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "sms_providers_status_idx" ON "sms_providers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sms_providers_code_key" ON "sms_providers"("code");

-- CreateIndex
CREATE INDEX "sms_provider_configs_business_id_idx" ON "sms_provider_configs"("business_id");

-- CreateIndex
CREATE INDEX "sms_provider_configs_provider_id_idx" ON "sms_provider_configs"("provider_id");

-- CreateIndex
CREATE INDEX "sms_provider_configs_status_idx" ON "sms_provider_configs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sms_provider_configs_business_id_provider_id_mode_key" ON "sms_provider_configs"("business_id", "provider_id", "mode");

-- CreateIndex
CREATE INDEX "sms_templates_business_id_idx" ON "sms_templates"("business_id");

-- CreateIndex
CREATE INDEX "sms_templates_template_type_idx" ON "sms_templates"("template_type");

-- CreateIndex
CREATE INDEX "sms_templates_status_idx" ON "sms_templates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sms_templates_business_id_name_key" ON "sms_templates"("business_id", "name");

-- CreateIndex
CREATE INDEX "sms_campaigns_business_id_idx" ON "sms_campaigns"("business_id");

-- CreateIndex
CREATE INDEX "sms_campaigns_template_id_idx" ON "sms_campaigns"("template_id");

-- CreateIndex
CREATE INDEX "sms_campaigns_campaign_type_idx" ON "sms_campaigns"("campaign_type");

-- CreateIndex
CREATE INDEX "sms_campaigns_status_idx" ON "sms_campaigns"("status");

-- CreateIndex
CREATE INDEX "sms_campaigns_scheduled_at_idx" ON "sms_campaigns"("scheduled_at");

-- CreateIndex
CREATE INDEX "sms_campaign_recipients_campaign_id_idx" ON "sms_campaign_recipients"("campaign_id");

-- CreateIndex
CREATE INDEX "sms_campaign_recipients_customer_id_idx" ON "sms_campaign_recipients"("customer_id");

-- CreateIndex
CREATE INDEX "sms_campaign_recipients_phone_idx" ON "sms_campaign_recipients"("phone");

-- CreateIndex
CREATE INDEX "sms_campaign_recipients_status_idx" ON "sms_campaign_recipients"("status");

-- CreateIndex
CREATE INDEX "sms_logs_business_id_idx" ON "sms_logs"("business_id");

-- CreateIndex
CREATE INDEX "sms_logs_campaign_id_idx" ON "sms_logs"("campaign_id");

-- CreateIndex
CREATE INDEX "sms_logs_recipient_id_idx" ON "sms_logs"("recipient_id");

-- CreateIndex
CREATE INDEX "sms_logs_provider_id_idx" ON "sms_logs"("provider_id");

-- CreateIndex
CREATE INDEX "sms_logs_phone_idx" ON "sms_logs"("phone");

-- CreateIndex
CREATE INDEX "sms_logs_status_idx" ON "sms_logs"("status");

-- CreateIndex
CREATE INDEX "sms_logs_provider_message_id_idx" ON "sms_logs"("provider_message_id");

-- CreateIndex
CREATE INDEX "sms_logs_created_at_idx" ON "sms_logs"("created_at");

-- CreateIndex
CREATE INDEX "supplier_suppliers_business_id_idx" ON "supplier_suppliers"("business_id");

-- CreateIndex
CREATE INDEX "supplier_suppliers_status_idx" ON "supplier_suppliers"("status");

-- CreateIndex
CREATE INDEX "supplier_suppliers_phone_idx" ON "supplier_suppliers"("phone");

-- CreateIndex
CREATE INDEX "supplier_suppliers_email_idx" ON "supplier_suppliers"("email");

-- CreateIndex
CREATE INDEX "supplier_product_map_business_id_idx" ON "supplier_product_map"("business_id");

-- CreateIndex
CREATE INDEX "supplier_product_map_supplier_id_idx" ON "supplier_product_map"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_product_map_product_id_idx" ON "supplier_product_map"("product_id");

-- CreateIndex
CREATE INDEX "supplier_product_map_variant_id_idx" ON "supplier_product_map"("variant_id");

-- CreateIndex
CREATE INDEX "supplier_product_map_status_idx" ON "supplier_product_map"("status");

-- CreateIndex
CREATE INDEX "supplier_purchase_orders_business_id_idx" ON "supplier_purchase_orders"("business_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_orders_supplier_id_idx" ON "supplier_purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_orders_location_id_idx" ON "supplier_purchase_orders"("location_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_orders_status_idx" ON "supplier_purchase_orders"("status");

-- CreateIndex
CREATE INDEX "supplier_purchase_orders_order_date_idx" ON "supplier_purchase_orders"("order_date");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_purchase_orders_business_id_purchase_order_no_key" ON "supplier_purchase_orders"("business_id", "purchase_order_no");

-- CreateIndex
CREATE INDEX "supplier_purchase_order_items_purchase_order_id_idx" ON "supplier_purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_order_items_product_id_idx" ON "supplier_purchase_order_items"("product_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_order_items_variant_id_idx" ON "supplier_purchase_order_items"("variant_id");

-- CreateIndex
CREATE INDEX "supplier_invoices_business_id_idx" ON "supplier_invoices"("business_id");

-- CreateIndex
CREATE INDEX "supplier_invoices_supplier_id_idx" ON "supplier_invoices"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_invoices_purchase_order_id_idx" ON "supplier_invoices"("purchase_order_id");

-- CreateIndex
CREATE INDEX "supplier_invoices_status_idx" ON "supplier_invoices"("status");

-- CreateIndex
CREATE INDEX "supplier_invoices_invoice_date_idx" ON "supplier_invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "supplier_invoices_due_date_idx" ON "supplier_invoices"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_invoices_business_id_invoice_no_key" ON "supplier_invoices"("business_id", "invoice_no");

-- CreateIndex
CREATE INDEX "supplier_invoice_items_supplier_invoice_id_idx" ON "supplier_invoice_items"("supplier_invoice_id");

-- CreateIndex
CREATE INDEX "supplier_invoice_items_product_id_idx" ON "supplier_invoice_items"("product_id");

-- CreateIndex
CREATE INDEX "supplier_invoice_items_variant_id_idx" ON "supplier_invoice_items"("variant_id");

-- CreateIndex
CREATE INDEX "supplier_payments_business_id_idx" ON "supplier_payments"("business_id");

-- CreateIndex
CREATE INDEX "supplier_payments_supplier_id_idx" ON "supplier_payments"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_payments_supplier_invoice_id_idx" ON "supplier_payments"("supplier_invoice_id");

-- CreateIndex
CREATE INDEX "supplier_payments_payment_date_idx" ON "supplier_payments"("payment_date");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_payments_business_id_payment_no_key" ON "supplier_payments"("business_id", "payment_no");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_business_id_idx" ON "supplier_purchase_returns"("business_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_supplier_id_idx" ON "supplier_purchase_returns"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_purchase_order_id_idx" ON "supplier_purchase_returns"("purchase_order_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_supplier_invoice_id_idx" ON "supplier_purchase_returns"("supplier_invoice_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_location_id_idx" ON "supplier_purchase_returns"("location_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_status_idx" ON "supplier_purchase_returns"("status");

-- CreateIndex
CREATE INDEX "supplier_purchase_returns_return_date_idx" ON "supplier_purchase_returns"("return_date");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_purchase_returns_business_id_return_no_key" ON "supplier_purchase_returns"("business_id", "return_no");

-- CreateIndex
CREATE INDEX "supplier_purchase_return_items_purchase_return_id_idx" ON "supplier_purchase_return_items"("purchase_return_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_return_items_product_id_idx" ON "supplier_purchase_return_items"("product_id");

-- CreateIndex
CREATE INDEX "supplier_purchase_return_items_variant_id_idx" ON "supplier_purchase_return_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_email_key" ON "system_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_phone_key" ON "system_users"("phone");

-- CreateIndex
CREATE INDEX "system_users_type_idx" ON "system_users"("type");

-- CreateIndex
CREATE INDEX "system_users_status_idx" ON "system_users"("status");

-- CreateIndex
CREATE INDEX "system_users_deleted_at_idx" ON "system_users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_profiles_user_id_key" ON "system_user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "system_user_profiles_deleted_at_idx" ON "system_user_profiles"("deleted_at");

-- CreateIndex
CREATE INDEX "system_email_verifications_user_id_idx" ON "system_email_verifications"("user_id");

-- CreateIndex
CREATE INDEX "system_email_verifications_purpose_idx" ON "system_email_verifications"("purpose");

-- CreateIndex
CREATE INDEX "system_email_verifications_expires_at_idx" ON "system_email_verifications"("expires_at");

-- CreateIndex
CREATE INDEX "system_password_resets_user_id_idx" ON "system_password_resets"("user_id");

-- CreateIndex
CREATE INDEX "system_password_resets_expires_at_idx" ON "system_password_resets"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_sessions_refresh_token_hash_key" ON "system_sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "system_sessions_user_id_idx" ON "system_sessions"("user_id");

-- CreateIndex
CREATE INDEX "system_sessions_expires_at_idx" ON "system_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "system_sessions_revoked_at_idx" ON "system_sessions"("revoked_at");

-- CreateIndex
CREATE INDEX "system_audit_logs_user_id_idx" ON "system_audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "system_audit_logs_business_id_idx" ON "system_audit_logs"("business_id");

-- CreateIndex
CREATE INDEX "system_audit_logs_feature_idx" ON "system_audit_logs"("feature");

-- CreateIndex
CREATE INDEX "system_audit_logs_entity_name_entity_id_idx" ON "system_audit_logs"("entity_name", "entity_id");

-- CreateIndex
CREATE INDEX "system_audit_logs_created_at_idx" ON "system_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "website_templates_category_idx" ON "website_templates"("category");

-- CreateIndex
CREATE INDEX "website_templates_status_idx" ON "website_templates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "website_templates_slug_key" ON "website_templates"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "website_websites_current_version_id_key" ON "website_websites"("current_version_id");

-- CreateIndex
CREATE INDEX "website_websites_business_id_idx" ON "website_websites"("business_id");

-- CreateIndex
CREATE INDEX "website_websites_template_id_idx" ON "website_websites"("template_id");

-- CreateIndex
CREATE INDEX "website_websites_status_idx" ON "website_websites"("status");

-- CreateIndex
CREATE UNIQUE INDEX "website_websites_business_id_slug_key" ON "website_websites"("business_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "website_configs_website_id_key" ON "website_configs"("website_id");

-- CreateIndex
CREATE INDEX "website_domains_website_id_idx" ON "website_domains"("website_id");

-- CreateIndex
CREATE INDEX "website_domains_domain_idx" ON "website_domains"("domain");

-- CreateIndex
CREATE INDEX "website_domains_subdomain_idx" ON "website_domains"("subdomain");

-- CreateIndex
CREATE INDEX "website_domains_domain_type_idx" ON "website_domains"("domain_type");

-- CreateIndex
CREATE INDEX "website_domains_is_primary_idx" ON "website_domains"("is_primary");

-- CreateIndex
CREATE INDEX "website_domains_verification_status_idx" ON "website_domains"("verification_status");

-- CreateIndex
CREATE INDEX "website_pages_website_id_idx" ON "website_pages"("website_id");

-- CreateIndex
CREATE INDEX "website_pages_page_type_idx" ON "website_pages"("page_type");

-- CreateIndex
CREATE INDEX "website_pages_status_idx" ON "website_pages"("status");

-- CreateIndex
CREATE INDEX "website_pages_is_homepage_idx" ON "website_pages"("is_homepage");

-- CreateIndex
CREATE UNIQUE INDEX "website_pages_website_id_slug_key" ON "website_pages"("website_id", "slug");

-- CreateIndex
CREATE INDEX "website_page_sections_page_id_idx" ON "website_page_sections"("page_id");

-- CreateIndex
CREATE INDEX "website_page_sections_component_id_idx" ON "website_page_sections"("component_id");

-- CreateIndex
CREATE INDEX "website_page_sections_section_key_idx" ON "website_page_sections"("section_key");

-- CreateIndex
CREATE INDEX "website_page_sections_status_idx" ON "website_page_sections"("status");

-- CreateIndex
CREATE INDEX "website_components_component_type_idx" ON "website_components"("component_type");

-- CreateIndex
CREATE INDEX "website_components_status_idx" ON "website_components"("status");

-- CreateIndex
CREATE UNIQUE INDEX "website_components_code_key" ON "website_components"("code");

-- CreateIndex
CREATE UNIQUE INDEX "website_theme_settings_website_id_key" ON "website_theme_settings"("website_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_seo_settings_page_id_key" ON "website_seo_settings"("page_id");

-- CreateIndex
CREATE INDEX "website_seo_settings_website_id_idx" ON "website_seo_settings"("website_id");

-- CreateIndex
CREATE INDEX "website_publish_versions_website_id_idx" ON "website_publish_versions"("website_id");

-- CreateIndex
CREATE INDEX "website_publish_versions_published_at_idx" ON "website_publish_versions"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "website_publish_versions_website_id_version_no_key" ON "website_publish_versions"("website_id", "version_no");

-- AddForeignKey
ALTER TABLE "business_businesses" ADD CONSTRAINT "business_businesses_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "system_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_businesses" ADD CONSTRAINT "business_businesses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_businesses" ADD CONSTRAINT "business_businesses_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_settings" ADD CONSTRAINT "business_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_branding" ADD CONSTRAINT "business_branding_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_configs" ADD CONSTRAINT "courier_configs_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "courier_couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_delivery_zone_areas" ADD CONSTRAINT "courier_delivery_zone_areas_delivery_zone_id_fkey" FOREIGN KEY ("delivery_zone_id") REFERENCES "courier_delivery_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipping_charges" ADD CONSTRAINT "courier_shipping_charges_delivery_zone_id_fkey" FOREIGN KEY ("delivery_zone_id") REFERENCES "courier_delivery_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipping_charges" ADD CONSTRAINT "courier_shipping_charges_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "courier_couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipments" ADD CONSTRAINT "courier_shipments_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "courier_couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipments" ADD CONSTRAINT "courier_shipments_delivery_zone_id_fkey" FOREIGN KEY ("delivery_zone_id") REFERENCES "courier_delivery_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipment_items" ADD CONSTRAINT "courier_shipment_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "courier_shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_receivables" ADD CONSTRAINT "courier_receivables_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "courier_couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_receivables" ADD CONSTRAINT "courier_receivables_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "courier_shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_settlements" ADD CONSTRAINT "courier_settlements_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "courier_couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_settlement_items" ADD CONSTRAINT "courier_settlement_items_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "courier_settlements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_settlement_items" ADD CONSTRAINT "courier_settlement_items_receivable_id_fkey" FOREIGN KEY ("receivable_id") REFERENCES "courier_receivables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_settlement_items" ADD CONSTRAINT "courier_settlement_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "courier_shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_account_transactions" ADD CONSTRAINT "finance_account_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "finance_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "finance_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "finance_expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entry_lines" ADD CONSTRAINT "finance_journal_entry_lines_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "finance_journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_journal_entry_lines" ADD CONSTRAINT "finance_journal_entry_lines_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "finance_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stocks" ADD CONSTRAINT "inventory_stocks_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "inventory_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_batches" ADD CONSTRAINT "inventory_stock_batches_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "inventory_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_movements" ADD CONSTRAINT "inventory_stock_movements_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "inventory_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_adjustments" ADD CONSTRAINT "inventory_stock_adjustments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "inventory_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_adjustment_items" ADD CONSTRAINT "inventory_stock_adjustment_items_adjustment_id_fkey" FOREIGN KEY ("adjustment_id") REFERENCES "inventory_stock_adjustments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_transfers" ADD CONSTRAINT "inventory_stock_transfers_from_location_id_fkey" FOREIGN KEY ("from_location_id") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_transfers" ADD CONSTRAINT "inventory_stock_transfers_to_location_id_fkey" FOREIGN KEY ("to_location_id") REFERENCES "inventory_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock_transfer_items" ADD CONSTRAINT "inventory_stock_transfer_items_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "inventory_stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_invoice_items" ADD CONSTRAINT "invoice_invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_asset_tags" ADD CONSTRAINT "media_asset_tags_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_asset_tags" ADD CONSTRAINT "media_asset_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "media_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_customer_addresses" ADD CONSTRAINT "order_customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "order_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_carts" ADD CONSTRAINT "order_carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "order_customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_cart_items" ADD CONSTRAINT "order_cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "order_carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_orders" ADD CONSTRAINT "order_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "order_customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_order_items" ADD CONSTRAINT "order_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_logs" ADD CONSTRAINT "order_status_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_return_items" ADD CONSTRAINT "order_return_items_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "order_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_return_items" ADD CONSTRAINT "order_return_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "order_returns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "order_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_plan_limits" ADD CONSTRAINT "package_plan_limits_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "package_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_addon_limits" ADD CONSTRAINT "package_addon_limits_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "package_addons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_subscriptions" ADD CONSTRAINT "package_subscriptions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "package_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_subscription_addons" ADD CONSTRAINT "package_subscription_addons_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "package_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_subscription_addons" ADD CONSTRAINT "package_subscription_addons_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "package_addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_usage_counters" ADD CONSTRAINT "package_usage_counters_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "package_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_gateway_configs" ADD CONSTRAINT "payment_gateway_configs_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "payment_gateways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "payment_gateways"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_webhook_events" ADD CONSTRAINT "payment_webhook_events_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "payment_gateways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_products" ADD CONSTRAINT "product_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_products" ADD CONSTRAINT "product_products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "product_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_products" ADD CONSTRAINT "product_products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attributes" ADD CONSTRAINT "product_variant_attributes_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attributes" ADD CONSTRAINT "product_variant_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attributes" ADD CONSTRAINT "product_variant_attributes_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "product_attribute_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "product_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_roles" ADD CONSTRAINT "rbac_roles_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_roles" ADD CONSTRAINT "rbac_roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_roles" ADD CONSTRAINT "rbac_roles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_role_permissions" ADD CONSTRAINT "rbac_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "rbac_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_user_role_map" ADD CONSTRAINT "rbac_user_role_map_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_user_role_map" ADD CONSTRAINT "rbac_user_role_map_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "rbac_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rbac_user_role_map" ADD CONSTRAINT "rbac_user_role_map_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_provider_configs" ADD CONSTRAINT "sms_provider_configs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "sms_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_campaigns" ADD CONSTRAINT "sms_campaigns_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "sms_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_campaign_recipients" ADD CONSTRAINT "sms_campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "sms_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "sms_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "sms_campaign_recipients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "sms_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product_map" ADD CONSTRAINT "supplier_product_map_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_orders" ADD CONSTRAINT "supplier_purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_order_items" ADD CONSTRAINT "supplier_purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "supplier_purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_invoices" ADD CONSTRAINT "supplier_invoices_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_invoices" ADD CONSTRAINT "supplier_invoices_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "supplier_purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_invoice_items" ADD CONSTRAINT "supplier_invoice_items_supplier_invoice_id_fkey" FOREIGN KEY ("supplier_invoice_id") REFERENCES "supplier_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_supplier_invoice_id_fkey" FOREIGN KEY ("supplier_invoice_id") REFERENCES "supplier_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_returns" ADD CONSTRAINT "supplier_purchase_returns_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_returns" ADD CONSTRAINT "supplier_purchase_returns_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "supplier_purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_returns" ADD CONSTRAINT "supplier_purchase_returns_supplier_invoice_id_fkey" FOREIGN KEY ("supplier_invoice_id") REFERENCES "supplier_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_purchase_return_items" ADD CONSTRAINT "supplier_purchase_return_items_purchase_return_id_fkey" FOREIGN KEY ("purchase_return_id") REFERENCES "supplier_purchase_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_profiles" ADD CONSTRAINT "system_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_email_verifications" ADD CONSTRAINT "system_email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_password_resets" ADD CONSTRAINT "system_password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_sessions" ADD CONSTRAINT "system_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_audit_logs" ADD CONSTRAINT "system_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_audit_logs" ADD CONSTRAINT "system_audit_logs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business_businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_websites" ADD CONSTRAINT "website_websites_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "website_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_websites" ADD CONSTRAINT "website_websites_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "website_publish_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_configs" ADD CONSTRAINT "website_configs_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_domains" ADD CONSTRAINT "website_domains_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_pages" ADD CONSTRAINT "website_pages_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_page_sections" ADD CONSTRAINT "website_page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "website_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_page_sections" ADD CONSTRAINT "website_page_sections_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "website_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_theme_settings" ADD CONSTRAINT "website_theme_settings_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_seo_settings" ADD CONSTRAINT "website_seo_settings_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_seo_settings" ADD CONSTRAINT "website_seo_settings_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "website_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_publish_versions" ADD CONSTRAINT "website_publish_versions_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website_websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
