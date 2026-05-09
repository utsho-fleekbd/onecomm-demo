import { Type } from "class-transformer";
import { SystemUserStatus } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class QueryEmployeesDto {
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

  @ApiPropertyOptional({ example: "john" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: SystemUserStatus,
    example: SystemUserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SystemUserStatus)
  status?: SystemUserStatus;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    enum: ["name", "email", "status", "createdAt", "updatedAt"],
    example: "createdAt",
  })
  @IsOptional()
  @IsIn(["name", "email", "status", "createdAt", "updatedAt"])
  sortBy?: "name" | "email" | "status" | "createdAt" | "updatedAt";

  @ApiPropertyOptional({
    enum: ["asc", "desc"],
    example: "desc",
  })
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
