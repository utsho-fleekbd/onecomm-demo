import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  MediaUploader,
  UploadableMediaFile,
  UploadMediaOptions,
  UploadedMediaFile,
} from "./media-uploader.types";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

@Injectable()
export class LocalMediaUploader implements MediaUploader {
  private readonly uploadRoot: string;
  private readonly publicUploadPrefix: string;

  constructor(configService: ConfigService) {
    this.uploadRoot = configService.getOrThrow<string>("MEDIA_UPLOAD_ROOT");
    this.publicUploadPrefix = configService.getOrThrow<string>(
      "PUBLIC_UPLOAD_PREFIX",
    );
  }

  async upload(
    file: UploadableMediaFile,
    options: UploadMediaOptions,
  ): Promise<UploadedMediaFile> {
    const extension = this.resolveExtension(file);
    const fileName = `${randomUUID()}${extension}`;
    const relativeDirectory = join("media", options.businessId);
    const absoluteDirectory = join(
      process.cwd(),
      this.uploadRoot,
      relativeDirectory,
    );
    const absolutePath = join(absoluteDirectory, fileName);

    await mkdir(absoluteDirectory, {
      recursive: true,
    });

    await writeFile(absolutePath, file.buffer);

    return {
      fileName: file.originalname,
      fileUrl: this.toPublicUrl(relativeDirectory, fileName),
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  private resolveExtension(file: UploadableMediaFile) {
    const extension = extname(file.originalname).toLowerCase();

    return extension || MIME_EXTENSION_MAP[file.mimetype] || "";
  }

  private toPublicUrl(relativeDirectory: string, fileName: string) {
    return `${this.publicUploadPrefix}/${relativeDirectory.replace(/\\/g, "/")}/${fileName}`;
  }
}
