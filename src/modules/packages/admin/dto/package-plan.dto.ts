import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  PackageBillingCycle,
  PackageLimitKey,
  PackageResetCycle,
  PackageStatus,
} from "@prisma/client";

export class PackagePlanLimitDto {
  @ApiProperty({
    enum: PackageLimitKey,
    example: PackageLimitKey.MAX_EMPLOYEES,
  })
  @IsEnum(PackageLimitKey)
  limitKey!: PackageLimitKey;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitValue!: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle;

  @ApiPropertyOptional({ example: "Maximum active employees" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class CreatePackagePlanDto {
  @ApiProperty({ example: "Starter" })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "For new shops" })
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

  @ApiPropertyOptional({ example: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  freeTrialDays?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ enum: PackageStatus, example: PackageStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ type: [PackagePlanLimitDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => PackagePlanLimitDto)
  limits?: PackagePlanLimitDto[];
}

export class UpdatePackagePlanDto extends PartialType(CreatePackagePlanDto) {}
