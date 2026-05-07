import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SelectBusinessDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  declare businessId: number;

  @ApiProperty({ example: "refresh-token" })
  @IsString()
  declare refreshToken: string;
}
