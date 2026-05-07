import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBusinessDto {
  @ApiProperty({ example: "Matrix" })
  @IsString()
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ example: "matrix" })
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
