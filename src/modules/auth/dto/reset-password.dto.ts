import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "OldPassword@123" })
  @IsString()
  @MinLength(6)
  declare oldPassword: string;

  @ApiProperty({ example: "NewPassword@123" })
  @IsString()
  @MinLength(6)
  declare newPassword: string;

  @ApiProperty({ example: "NewPassword@123" })
  @IsString()
  @MinLength(6)
  declare confirmPassword: string;
}
