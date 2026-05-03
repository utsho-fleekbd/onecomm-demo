import { ApiPropertyOptional } from "@nestjs/swagger";
import { StoreStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class StoreQueryDto {
  @ApiPropertyOptional({ example: "main" })
  @IsOptional()
  @IsString()
  declare search?: string;

  @ApiPropertyOptional({ enum: StoreStatus, example: StoreStatus.ACTIVE })
  @IsOptional()
  @IsEnum(StoreStatus)
  declare status?: StoreStatus;
}
