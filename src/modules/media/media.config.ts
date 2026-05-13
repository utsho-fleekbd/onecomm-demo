import { ConfigService } from "@nestjs/config";

export type MediaLimits = {
  maxBulkImageFiles: number;
  maxBulkDeleteImages: number;
  maxImageSizeBytes: number;
};

const parsePositiveInteger = (value: string | undefined, key: string) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }

  return parsedValue;
};

export const getMediaLimits = (configService: ConfigService): MediaLimits => ({
  maxBulkImageFiles: parsePositiveInteger(
    configService.get<string>("MEDIA_MAX_BULK_IMAGE_FILES"),
    "MEDIA_MAX_BULK_IMAGE_FILES",
  ),
  maxBulkDeleteImages: parsePositiveInteger(
    configService.get<string>("MEDIA_MAX_BULK_DELETE_IMAGES"),
    "MEDIA_MAX_BULK_DELETE_IMAGES",
  ),
  maxImageSizeBytes: parsePositiveInteger(
    configService.get<string>("MEDIA_MAX_IMAGE_SIZE_BYTES"),
    "MEDIA_MAX_IMAGE_SIZE_BYTES",
  ),
});
