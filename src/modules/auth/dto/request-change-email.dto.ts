// src/modules/users/dto/request-change-email.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

export class RequestChangeEmailDto {
  @ApiProperty({ example: "newemail@example.com" })
  @IsEmail()
  @MaxLength(150)
  declare newEmail: string;
}
