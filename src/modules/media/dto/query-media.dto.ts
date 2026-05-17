import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class QueryMediaDto {
  @ApiPropertyOptional({
    example: "hero,banner",
    description: "Comma-separated tags. Returns images matching any tag.",
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: "createdAt",
    enum: ["createdAt", "fileName", "fileSize"],
  })
  @IsOptional()
  @IsIn(["createdAt", "fileName", "fileSize"])
  sortBy?: "createdAt" | "fileName" | "fileSize" = "createdAt";

  @ApiPropertyOptional({
    example: "desc",
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
