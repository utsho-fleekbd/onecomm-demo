import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BusinessStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class CreateBusinessSettingDto {
  @ApiPropertyOptional({ example: "ORD" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  declare orderPrefix?: string;

  @ApiPropertyOptional({ example: "INV" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  declare invoicePrefix?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999999)
  declare lowStockThreshold?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  declare allowBackorder?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  declare autoConfirmOrder?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  declare codEnabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  declare onlinePaymentEnabled?: boolean;
}

export class CreateBusinessBrandingDto {
  @ApiPropertyOptional({ example: "https://example.com/logo.png" })
  @IsOptional()
  @IsString()
  declare logoUrl?: string;

  @ApiPropertyOptional({ example: "https://example.com/favicon.ico" })
  @IsOptional()
  @IsString()
  declare faviconUrl?: string;

  @ApiPropertyOptional({ example: "#000742" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, {
    message: "primaryColor must be a valid hex color",
  })
  declare primaryColor?: string;

  @ApiPropertyOptional({ example: "#ffffff" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, {
    message: "secondaryColor must be a valid hex color",
  })
  declare secondaryColor?: string;

  @ApiPropertyOptional({ example: "#f97316" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, {
    message: "accentColor must be a valid hex color",
  })
  declare accentColor?: string;

  @ApiPropertyOptional({ example: "Inter" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  declare fontFamily?: string;

  @ApiPropertyOptional({ example: "My Business" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  declare seoTitle?: string;

  @ApiPropertyOptional({ example: "An awesome business" })
  @IsOptional()
  @IsString()
  declare seoDescription?: string;
}

export class CreateBusinessDto {
  @ApiProperty({ example: "My Business" })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ example: "business@example.com" })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  declare email?: string;

  @ApiPropertyOptional({ example: "+8801712345678" })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  declare phone?: string;

  @ApiPropertyOptional({ example: "Bangladesh" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  declare country?: string;

  @ApiPropertyOptional({ example: "BDT", default: "BDT" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^[A-Z]{3,10}$/, {
    message: "currencyCode must be uppercase, for example BDT",
  })
  declare currencyCode?: string;

  @ApiPropertyOptional({ example: "Asia/Dhaka", default: "Asia/Dhaka" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  declare timezone?: string;

  @ApiPropertyOptional({
    enum: BusinessStatus,
    default: BusinessStatus.TRIAL,
  })
  @IsOptional()
  @IsEnum(BusinessStatus)
  declare status?: BusinessStatus;

  @ApiPropertyOptional({ type: CreateBusinessSettingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessSettingDto)
  declare settings?: CreateBusinessSettingDto;

  @ApiPropertyOptional({ type: CreateBusinessBrandingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessBrandingDto)
  declare branding?: CreateBusinessBrandingDto;
}
