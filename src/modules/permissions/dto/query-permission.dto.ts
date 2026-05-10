import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PermissionAction, RbacFeature } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

export class QueryPermissionDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roleId?: number;

  @ApiPropertyOptional({
    enum: RbacFeature,
    example: RbacFeature.BUSINESS,
  })
  @IsOptional()
  @IsEnum(RbacFeature)
  feature?: RbacFeature;

  @ApiPropertyOptional({
    enum: PermissionAction,
    example: PermissionAction.READ,
  })
  @IsOptional()
  @IsEnum(PermissionAction)
  action?: PermissionAction;
}
