import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Neo" })
  @IsString()
  @MaxLength(100)
  declare name: string;

  @ApiProperty({ example: "neo@matrix.com" })
  @IsEmail()
  @MaxLength(150)
  declare email: string;

  @ApiProperty({ example: "U$ha11NotPass" })
  @IsString()
  @MinLength(6)
  declare password: string;

  @ApiProperty({ example: "Matrix" })
  @IsString()
  @IsOptional()
  declare businessName?: string;
}
