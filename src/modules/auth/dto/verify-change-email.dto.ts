import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, MaxLength } from "class-validator";

export class VerifyChangeEmailDto {
  @ApiProperty({ example: "newemail@example.com" })
  @IsEmail()
  @MaxLength(150)
  declare email: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  @Length(6, 6)
  declare otp: string;
}
