import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from "class-validator";

export class DeleteMediaBulkDto {
  @ApiProperty({
    example: [
      "2d8d0f8f-95aa-4f23-a2fd-0ca6f5f8a913",
      "817f7bc6-3c3b-4de8-b6df-05f9a9ab1e24",
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  declare mediaAssetIds: string[];
}
