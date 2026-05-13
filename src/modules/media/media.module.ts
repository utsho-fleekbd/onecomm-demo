import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { BusinessModule } from "../business/business.module";
import { PermissionModule } from "../permissions/permission.module";
import { MEDIA_UPLOADER } from "./uploaders/media-uploader.constants";
import { LocalMediaUploader } from "./uploaders/local-media.uploader";
import { getMediaLimits } from "./media.config";
import { MEDIA_LIMITS } from "./uploaders/media-uploader.constants";

@Module({
  imports: [
    BusinessModule,
    PermissionModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const limits = getMediaLimits(configService);

        return {
          limits: {
            fileSize: limits.maxImageSizeBytes,
            files: limits.maxBulkImageFiles,
          },
        };
      },
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    LocalMediaUploader,
    {
      provide: MEDIA_LIMITS,
      inject: [ConfigService],
      useFactory: getMediaLimits,
    },
    {
      provide: MEDIA_UPLOADER,
      useExisting: LocalMediaUploader,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
