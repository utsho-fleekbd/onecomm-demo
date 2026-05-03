import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Electronic" })
  @IsString()
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ example: "electronic" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  declare slug?: string;

  @ApiPropertyOptional({ example: "parent-category-id" })
  @IsOptional()
  @IsString()
  declare parentId?: string;
}
