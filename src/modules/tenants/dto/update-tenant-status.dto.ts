import { ApiProperty } from "@nestjs/swagger";
import { SystemUserStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateTenantStatusDto {
  @ApiProperty({
    enum: SystemUserStatus,
    example: SystemUserStatus.ACTIVE,
  })
  @IsEnum(SystemUserStatus)
  status!: SystemUserStatus;
}
