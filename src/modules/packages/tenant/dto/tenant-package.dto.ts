import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CheckoutPackageAddonDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}

export class CancelTenantSubscriptionDto {
  @ApiPropertyOptional({ example: "Moving to another plan later" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
