import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class SelectStoreDto {
  @ApiProperty({ example: "business-id" })
  @IsUUID()
  declare businessId: number;
}
