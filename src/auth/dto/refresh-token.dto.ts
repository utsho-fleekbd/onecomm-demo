import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ example: "refresh-token" })
  @IsString()
  declare refreshToken: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare businessId?: number;
}
