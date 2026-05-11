import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";

import { PermissionItemDto } from "./permission-item.dto";

export class AddPermissionDto {
  @ApiProperty({
    type: [PermissionItemDto],
    example: [
      {
        feature: "BUSINESS",
        action: "READ",
      },
      {
        feature: "BUSINESS",
        action: "UPDATE",
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  declare permissions: PermissionItemDto[];
}
