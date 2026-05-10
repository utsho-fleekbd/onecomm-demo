import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PermissionAction, RbacFeature } from "@prisma/client";

export class PermissionItemDto {
  @ApiProperty({
    enum: RbacFeature,
    example: RbacFeature.BUSINESS,
  })
  @IsEnum(RbacFeature)
  declare feature: RbacFeature;

  @ApiProperty({
    enum: PermissionAction,
    example: PermissionAction.READ,
  })
  @IsEnum(PermissionAction)
  declare action: PermissionAction;
}
