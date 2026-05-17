import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductSimpleStatus } from "@prisma/client";

export class CreateProductAttributeValueDto {
  @ApiProperty({ example: "Red" })
  @IsString()
  @MaxLength(150)
  value!: string;
}

export class UpdateProductAttributeValueDto extends PartialType(
  CreateProductAttributeValueDto,
) {}

export class ProductAttributeBaseDto {
  @ApiProperty({ example: "Color" })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ enum: ProductSimpleStatus })
  @IsOptional()
  @IsEnum(ProductSimpleStatus)
  status?: ProductSimpleStatus;
}

export class CreateProductAttributeDto extends ProductAttributeBaseDto {
  @ApiPropertyOptional({ type: [CreateProductAttributeValueDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeValueDto)
  values?: CreateProductAttributeValueDto[];
}

export class UpdateProductAttributeDto extends PartialType(
  ProductAttributeBaseDto,
) {}
