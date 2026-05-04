import { PartialType } from "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  declare status?: UserStatus;
}
