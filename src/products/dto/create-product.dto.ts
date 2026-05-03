import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @ApiPropertyOptional({ example: "category-id" })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: "iPhone 15 Pro" })
  @IsString()
  @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ example: "iphone-15-pro" })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  declare slug?: string;

  @ApiPropertyOptional({ example: "IP15PRO-001" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  declare sku?: string;

  @ApiPropertyOptional({ example: "Latest Apple iPhone model" })
  @IsOptional()
  @IsString()
  declare description?: string;

  @ApiProperty({ example: 120000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  declare price: number;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  declare status?: ProductStatus;
}
