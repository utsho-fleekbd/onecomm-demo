import { Module } from "@nestjs/common";

import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { BusinessModule } from "../business/business.module";
import { PermissionModule } from "../permissions/permission.module";
import { MEDIA_UPLOADER } from "./uploaders/media-uploader.constants";
import { LocalMediaUploader } from "./uploaders/local-media.uploader";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    BusinessModule,
    PermissionModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const maxImageSizeBytes = configService.getOrThrow<number>(
          "MAX_IMAGE_SIZE_BYTES",
        );

        return {
          limits: {
            fileSize: Number(maxImageSizeBytes),
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
      provide: MEDIA_UPLOADER,
      useExisting: LocalMediaUploader,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
