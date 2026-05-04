import { ApiPropertyOptional } from "@nestjs/swagger";
import { StoreMemberStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UserQueryDto {
  @ApiPropertyOptional({ example: "john" })
  @IsOptional()
  @IsString()
  declare search?: string;

  @ApiPropertyOptional({
    enum: StoreMemberStatus,
    example: StoreMemberStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StoreMemberStatus)
  declare status?: StoreMemberStatus;
}
