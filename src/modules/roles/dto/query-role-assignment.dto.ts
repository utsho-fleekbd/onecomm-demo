import { Type } from "class-transformer";
import { UserRoleMapStatus } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

export class QueryRoleAssignmentsDto {
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

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roleId?: number;

  @ApiPropertyOptional({
    enum: UserRoleMapStatus,
    example: UserRoleMapStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserRoleMapStatus)
  status?: UserRoleMapStatus;
}
