import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SelectStoreDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  declare businessId: number;
}
