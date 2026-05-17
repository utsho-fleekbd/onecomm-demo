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
import { ProductAttributeScope, ProductSimpleStatus } from "@prisma/client";

export class CreateProductAttributeValueDto {
  @ApiProperty({ example: "Red" })
  @IsString()
  @MaxLength(100)
  name!: string;
}

export class UpdateProductAttributeValueDto extends PartialType(
  CreateProductAttributeValueDto,
) {}

export class CreateProductAttributeDto {
  @ApiProperty({ example: "Color" })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    enum: ProductAttributeScope,
    example: ProductAttributeScope.VARIANT,
  })
  @IsEnum(ProductAttributeScope)
  scope!: ProductAttributeScope;

  @ApiPropertyOptional({ enum: ProductSimpleStatus })
  @IsOptional()
  @IsEnum(ProductSimpleStatus)
  status?: ProductSimpleStatus;

  @ApiPropertyOptional({ type: [CreateProductAttributeValueDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeValueDto)
  values?: CreateProductAttributeValueDto[];
}

export class UpdateProductAttributeDto extends PartialType(
  CreateProductAttributeDto,
) {}
