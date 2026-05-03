import { ApiPropertyOptional } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ProductQueryDto {
  @ApiPropertyOptional({ example: "iphone" })
  @IsOptional()
  @IsString()
  declare search?: string;

  @ApiPropertyOptional({ example: "category-id" })
  @IsOptional()
  @IsString()
  declare categoryId?: string;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  declare status?: ProductStatus;
}
