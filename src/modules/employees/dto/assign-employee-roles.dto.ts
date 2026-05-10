import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsInt, Min } from "class-validator";

export class AssignEmployeeRolesDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: "This replaces the employee's active roles for this business.",
  })
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  declare roleIds: number[];
}
