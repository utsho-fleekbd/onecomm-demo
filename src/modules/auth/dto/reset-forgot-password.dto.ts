import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class ResetForgotPasswordDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @MaxLength(150)
  declare email: string;

  @ApiProperty({ example: "verification_uuid_here" })
  @IsString()
  declare verificationId: string;

  @ApiProperty({ example: "NewPassword@123" })
  @IsString()
  @MinLength(6)
  declare newPassword: string;

  @ApiProperty({ example: "NewPassword@123" })
  @IsString()
  @MinLength(6)
  declare confirmPassword: string;
}
