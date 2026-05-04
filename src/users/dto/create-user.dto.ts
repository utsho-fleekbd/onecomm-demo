import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StoreMemberStatus } from "@prisma/client";
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  declare name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @MaxLength(255)
  declare email: string;

  @ApiProperty({ example: "StrongPass123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  declare password: string;

  @ApiPropertyOptional({
    enum: StoreMemberStatus,
    example: StoreMemberStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StoreMemberStatus)
  declare status?: StoreMemberStatus;

  @ApiPropertyOptional({
    example: ["role-uuid-1", "role-uuid-2"],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  declare roleIds?: string[];
}
