import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

export class SelectBusinessDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare businessId: number;

  @ApiProperty({ example: "refresh-token" })
  @IsString()
  declare refreshToken: string;
}
