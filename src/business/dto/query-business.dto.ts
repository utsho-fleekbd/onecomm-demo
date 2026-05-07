import { BusinessStatus } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class QueryBusinessDto {
  @ApiPropertyOptional({ example: "matrix" })
  @IsOptional()
  @IsString()
  declare search?: string;

  @ApiPropertyOptional({ enum: BusinessStatus, example: BusinessStatus.ACTIVE })
  @IsOptional()
  @IsEnum(BusinessStatus)
  declare status?: BusinessStatus;
}
