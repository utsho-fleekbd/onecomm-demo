import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "John" })
  @IsString()
  @MaxLength(100)
  declare name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @MaxLength(150)
  declare email: string;

  @ApiProperty({ example: "Password@123" })
  @IsString()
  @MinLength(6)
  declare password: string;

  @ApiProperty({ example: "My Business" })
  @IsString()
  @IsOptional()
  businessName: string = "My Business";
}
