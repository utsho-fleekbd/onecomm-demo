import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class SelectStoreDto {
  @ApiProperty({ example: "store-uuid" })
  @IsUUID()
  declare storeId: string;
}
