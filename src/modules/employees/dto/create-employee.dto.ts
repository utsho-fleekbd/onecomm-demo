import { Type } from "class-transformer";
import { SystemUserStatus } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

import { EmployeeProfileDto } from "./employee-profile.dto";

export class CreateEmployeeDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  declare name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @MaxLength(255)
  declare email: string;

  @ApiPropertyOptional({ example: "+8801711111111" })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(30)
  declare phone?: string;

  @ApiProperty({ example: "Password@123" })
  @IsString()
  @MinLength(8)
  declare password: string;

  @ApiPropertyOptional({
    enum: SystemUserStatus,
    example: SystemUserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SystemUserStatus)
  status?: SystemUserStatus;

  @ApiPropertyOptional({ type: EmployeeProfileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeProfileDto)
  profile?: EmployeeProfileDto;

  @ApiPropertyOptional({
    example: [1, 2],
    description: "Optional RBAC role IDs to assign after employee creation.",
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds?: number[];
}
