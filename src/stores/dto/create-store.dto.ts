import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateStoreDto {
  @ApiProperty({ example: "Neon Store" })
  @IsString()
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ example: "neon-store" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  declare slug?: string;

  @ApiPropertyOptional({ example: "01757832098" })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  declare phone?: string;

  @ApiPropertyOptional({ example: "Dhaka, Bangladesh" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  declare address?: string;
}
