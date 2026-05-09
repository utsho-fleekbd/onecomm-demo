import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CommonStatus } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class QueryRoleDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: "manager" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: CommonStatus,
    example: CommonStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    enum: ["name", "status", "createdAt", "updatedAt"],
    example: "createdAt",
  })
  @IsOptional()
  @IsIn(["name", "status", "createdAt", "updatedAt"])
  sortBy?: "name" | "status" | "createdAt" | "updatedAt";

  @ApiPropertyOptional({
    enum: ["asc", "desc"],
    example: "desc",
  })
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
