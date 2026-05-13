import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";
import {
  PackageBillingCycle,
  PackageLimitKey,
  PackageResetCycle,
  PackageStatus,
  PackageSubscriptionAddonStatus,
  PackageSubscriptionStatus,
} from "@prisma/client";

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ example: "Starter" })
  @IsOptional()
  @IsString()
  search?: string;
}

// ======================================================
// PACKAGE PLAN DTOs
// ======================================================

export class CreatePackagePlanDto {
  @ApiProperty({ example: "Starter" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "Best for small businesses" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    enum: PackageBillingCycle,
    example: PackageBillingCycle.MONTHLY,
  })
  @IsEnum(PackageBillingCycle)
  billingCycle!: PackageBillingCycle;

  @ApiPropertyOptional({ example: "BDT", default: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string = "BDT";

  @ApiPropertyOptional({ example: 7, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  freeTrialDays?: number = 0;

  @ApiPropertyOptional({
    enum: PackageStatus,
    example: PackageStatus.ACTIVE,
    default: PackageStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus = PackageStatus.ACTIVE;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number = 0;
}

export class UpdatePackagePlanDto {
  @ApiPropertyOptional({ example: "Growth" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: "Best for growing businesses" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1999 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    enum: PackageBillingCycle,
    example: PackageBillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(PackageBillingCycle)
  billingCycle?: PackageBillingCycle;

  @ApiPropertyOptional({ example: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  freeTrialDays?: number;

  @ApiPropertyOptional({
    enum: PackageStatus,
    example: PackageStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

// ======================================================
// PACKAGE PLAN LIMIT DTOs
// ======================================================

export class CreatePackagePlanLimitDto {
  @ApiProperty({
    enum: PackageLimitKey,
    example: PackageLimitKey.MAX_PRODUCTS,
  })
  @IsEnum(PackageLimitKey)
  limitKey!: PackageLimitKey;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitValue!: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.LIFETIME,
    default: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle = PackageResetCycle.LIFETIME;

  @ApiPropertyOptional({ example: "Maximum product creation limit" })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePackagePlanLimitDto {
  @ApiPropertyOptional({
    enum: PackageLimitKey,
    example: PackageLimitKey.MAX_PRODUCTS,
  })
  @IsOptional()
  @IsEnum(PackageLimitKey)
  limitKey?: PackageLimitKey;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitValue?: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle;

  @ApiPropertyOptional({ example: "Updated product limit" })
  @IsOptional()
  @IsString()
  description?: string;
}

// ======================================================
// ADDON DTOs
// ======================================================

export class CreatePackageAddonDto {
  @ApiProperty({ example: "Extra SMS Pack" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "Adds extra SMS credits" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    enum: PackageBillingCycle,
    example: PackageBillingCycle.MONTHLY,
  })
  @IsEnum(PackageBillingCycle)
  billingCycle!: PackageBillingCycle;

  @ApiPropertyOptional({ example: "BDT", default: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string = "BDT";

  @ApiProperty({
    enum: PackageLimitKey,
    example: PackageLimitKey.SMS_CREDITS,
  })
  @IsEnum(PackageLimitKey)
  limitKey!: PackageLimitKey;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitValue!: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.MONTHLY,
    default: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle = PackageResetCycle.LIFETIME;

  @ApiPropertyOptional({
    enum: PackageStatus,
    example: PackageStatus.ACTIVE,
    default: PackageStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus = PackageStatus.ACTIVE;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number = 0;

  @ApiPropertyOptional({
    example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456",
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}

export class UpdatePackageAddonDto {
  @ApiPropertyOptional({ example: "Extra Staff Pack" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: "Adds extra staff capacity" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 700 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    enum: PackageBillingCycle,
    example: PackageBillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(PackageBillingCycle)
  billingCycle?: PackageBillingCycle;

  @ApiPropertyOptional({ example: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string;

  @ApiPropertyOptional({
    enum: PackageLimitKey,
    example: PackageLimitKey.MAX_STAFF,
  })
  @IsOptional()
  @IsEnum(PackageLimitKey)
  limitKey?: PackageLimitKey;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitValue?: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle;

  @ApiPropertyOptional({
    enum: PackageStatus,
    example: PackageStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({
    example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456",
  })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}

// ======================================================
// SUBSCRIPTION DTOs
// ======================================================

export class CreatePackageSubscriptionDto {
  @ApiProperty({ example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456" })
  @IsUUID()
  tenantId!: string;

  @ApiProperty({ example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456" })
  @IsUUID()
  packageId!: string;

  @ApiPropertyOptional({
    enum: PackageSubscriptionStatus,
    example: PackageSubscriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageSubscriptionStatus)
  status?: PackageSubscriptionStatus;

  @ApiPropertyOptional({ example: "2026-05-13T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @ApiPropertyOptional({ example: "2026-05-13T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  currentPeriodStart?: string;

  @ApiPropertyOptional({ example: "2026-06-13T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  currentPeriodEnd?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean = true;
}

export class ChangePackageSubscriptionPlanDto {
  @ApiProperty({ example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456" })
  @IsUUID()
  packageId!: string;

  @ApiPropertyOptional({ example: "2026-05-13T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;
}

export class CancelPackageSubscriptionDto {
  @ApiPropertyOptional({ example: "Tenant requested cancellation" })
  @IsOptional()
  @IsString()
  endReason?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  immediate?: boolean = false;
}

export class RenewPackageSubscriptionDto {
  @ApiPropertyOptional({ example: "2026-05-13T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}

// ======================================================
// SUBSCRIPTION ADDON DTOs
// ======================================================

export class CreatePackageSubscriptionAddonDto {
  @ApiProperty({ example: "8c01a8c9-87d2-4f4f-bb99-9f3f3a123456" })
  @IsUUID()
  addonId!: string;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}

export class UpdatePackageSubscriptionAddonDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    enum: PackageSubscriptionAddonStatus,
    example: PackageSubscriptionAddonStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PackageSubscriptionAddonStatus)
  status?: PackageSubscriptionAddonStatus;
}

// ======================================================
// USAGE DTOs
// ======================================================

export class UpsertPackageUsageCounterDto {
  @ApiProperty({
    enum: PackageLimitKey,
    example: PackageLimitKey.SMS_CREDITS,
  })
  @IsEnum(PackageLimitKey)
  limitKey!: PackageLimitKey;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  usedValue!: number;

  @ApiProperty({ example: "2026-05-01T00:00:00.000Z" })
  @IsDateString()
  periodStart!: string;

  @ApiProperty({ example: "2026-05-31T23:59:59.999Z" })
  @IsDateString()
  periodEnd!: string;
}

export class IncrementPackageUsageDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  value!: number;

  @ApiProperty({ example: "2026-05-01T00:00:00.000Z" })
  @IsDateString()
  periodStart!: string;

  @ApiProperty({ example: "2026-05-31T23:59:59.999Z" })
  @IsDateString()
  periodEnd!: string;
}