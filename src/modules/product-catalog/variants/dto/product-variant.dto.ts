import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductVariantStatus } from "@prisma/client";
import { ProductImagesDto } from "../../common/dto/product-media.dto";

export class ProductVariantAttributeInputDto {
  @ApiProperty({ example: "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913" })
  @IsUUID()
  attributeId!: string;

  @ApiProperty({ example: "8f375e53-4a7e-49dd-ae7c-3a5d429c7963" })
  @IsUUID()
  attributeValueId!: string;
}

export class CreateProductVariantDto extends ProductImagesDto {
  @ApiProperty({ example: "Red / XL" })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: "SKU-RED-XL" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({ example: "0123456789012" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ enum: ProductVariantStatus })
  @IsOptional()
  @IsEnum(ProductVariantStatus)
  status?: ProductVariantStatus;

  @ApiPropertyOptional({ type: [ProductVariantAttributeInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantAttributeInputDto)
  attributes?: ProductVariantAttributeInputDto[];
}

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
