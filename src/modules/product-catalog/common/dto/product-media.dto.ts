import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ProductImageInputDto {
  @ApiPropertyOptional({ example: "https://cdn.example.com/product.jpg" })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ example: "Front view" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;
}

export class ProductTagIdsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];
}

export class ProductImagesDto {
  @ApiPropertyOptional({ type: [ProductImageInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageInputDto)
  images?: ProductImageInputDto[];
}
