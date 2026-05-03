import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryQueryDto {
  @ApiPropertyOptional({ example: "electronic" })
  @IsOptional()
  @IsString()
  declare search?: string;
}
