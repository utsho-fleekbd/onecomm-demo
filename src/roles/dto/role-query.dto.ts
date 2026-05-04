import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class RoleQueryDto {
  @ApiPropertyOptional({ example: "manager" })
  @IsOptional()
  @IsString()
  declare search?: string;
}
