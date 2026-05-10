import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommonStatus } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

import { RolePermissionDto } from "./role-permission.dto";

export class CreateRoleDto {
  @ApiProperty({
    example: "Store Manager",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({
    example: "Can manage products, orders, and employees.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: CommonStatus,
    example: CommonStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;

  @ApiPropertyOptional({
    type: [RolePermissionDto],
    example: [
      {
        feature: "BUSINESS",
        action: "READ",
      },
      {
        feature: "BUSINESS",
        action: "UPDATE",
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionDto)
  permissions?: RolePermissionDto[];
}
