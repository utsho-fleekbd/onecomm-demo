import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  PackageBillingCycle,
  PackageLimitKey,
  PackageResetCycle,
  PackageStatus,
} from "@prisma/client";

export class CreatePackageAddonDto {
  @ApiProperty({ example: "Extra employees" })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "Adds more employee seats" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 299 })
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

  @ApiProperty({
    enum: PackageLimitKey,
    example: PackageLimitKey.MAX_EMPLOYEES,
  })
  @IsEnum(PackageLimitKey)
  limitKey!: PackageLimitKey;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limitValue!: number;

  @ApiPropertyOptional({
    enum: PackageResetCycle,
    example: PackageResetCycle.LIFETIME,
  })
  @IsOptional()
  @IsEnum(PackageResetCycle)
  resetCycle?: PackageResetCycle;

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
}

export class UpdatePackageAddonDto extends PartialType(CreatePackageAddonDto) {}
