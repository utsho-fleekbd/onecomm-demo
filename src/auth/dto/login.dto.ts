import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "neo@matrix.com" })
  @IsEmail()
  @MaxLength(150)
  declare email: string;

  @ApiProperty({ example: "U$ha11NotPass" })
  @IsString()
  @MinLength(6)
  declare password: string;
}
