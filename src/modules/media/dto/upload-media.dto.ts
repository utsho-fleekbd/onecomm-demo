import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UploadMediaDto {
  @ApiPropertyOptional({
    example: "Hero banner",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @ApiPropertyOptional({
    example: "hero,banner,homepage",
    description: "Comma-separated tags.",
  })
  @IsOptional()
  @IsString()
  tags?: string;
}
