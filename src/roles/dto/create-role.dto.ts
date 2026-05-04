import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "Manager" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ example: "Can manage products, orders and inventory" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  declare description?: string;

  @ApiPropertyOptional({
    example: ["permission-uuid-1", "permission-uuid-2"],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  declare permissionIds?: string[];
}
