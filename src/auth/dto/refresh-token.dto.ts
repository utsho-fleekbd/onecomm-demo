import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  declare refreshToken: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare businessId?: number;
}
