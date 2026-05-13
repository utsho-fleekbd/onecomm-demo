import {
  BadRequestException,
  Inject,
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import {
  MediaAssetStatus,
  MediaFileType,
  MediaTagStatus,
  Prisma,
} from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { BusinessService } from "../business/business.service";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import {
  apiResponse,
  paginatedResponse,
} from "../../common/utils/api-response.util";
import { QueryMediaDto } from "./dto/query-media.dto";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { MEDIA_UPLOADER } from "./uploaders/media-uploader.constants";
import type {
  MediaUploader,
  UploadableMediaFile,
} from "./uploaders/media-uploader.types";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MEDIA_ASSET_INCLUDE = {
  tags: {
    include: {
      tag: true,
    },
    orderBy: {
      tag: {
        name: "asc",
      },
    },
  },
} satisfies Prisma.MediaAssetInclude;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessService: BusinessService,
    @Inject(MEDIA_UPLOADER)
    private readonly uploader: MediaUploader,
  ) {}

  async uploadImage(
    currentUser: CurrentUserPayload,
    businessId: string,
    file: UploadableMediaFile | undefined,
    dto: UploadMediaDto,
  ) {
    console.log("Uploaded file from Swagger:", {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      bufferLength: file?.buffer?.length,
      hasBuffer: Buffer.isBuffer(file?.buffer),
    });

    await this.businessService.assertCanAccessBusiness(currentUser, businessId);
    this.assertValidImage(file);

    const tags = this.normalizeTags(dto.tags);
    const uploadedFile = await this.uploader.upload(file, {
      businessId,
    });

    const asset = await this.prisma.mediaAsset.create({
      data: {
        businessId,
        uploadedBy: currentUser.id,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl,
        fileType: MediaFileType.IMAGE,
        mimeType: uploadedFile.mimeType,
        fileSize: uploadedFile.fileSize,
        altText: this.normalizeNullableText(dto.altText),
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: {
                  businessId_name: {
                    businessId,
                    name: tag,
                  },
                },
                create: {
                  businessId,
                  name: tag,
                  status: MediaTagStatus.ACTIVE,
                },
              },
            },
          })),
        },
      },
      include: MEDIA_ASSET_INCLUDE,
    });

    return apiResponse(asset, "Image uploaded successfully");
  }

  async findImages(
    currentUser: CurrentUserPayload,
    businessId: string,
    query: QueryMediaDto,
  ) {
    await this.businessService.assertCanAccessBusiness(currentUser, businessId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const tags = this.normalizeTags(query.tags);

    const where: Prisma.MediaAssetWhereInput = {
      businessId,
      fileType: MediaFileType.IMAGE,
      status: MediaAssetStatus.ACTIVE,
      deletedAt: null,
      ...(tags.length > 0 && {
        tags: {
          some: {
            tag: {
              businessId,
              status: MediaTagStatus.ACTIVE,
              name: {
                in: tags,
                mode: "insensitive",
              },
            },
          },
        },
      }),
    };

    const orderBy: Prisma.MediaAssetOrderByWithRelationInput = {
      [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc",
    };

    const [items, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: MEDIA_ASSET_INCLUDE,
      }),
      this.prisma.mediaAsset.count({
        where,
      }),
    ]);

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  private assertValidImage(
    file: UploadableMediaFile | undefined,
  ): asserts file is UploadableMediaFile {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    if (!file.buffer || !Buffer.isBuffer(file.buffer)) {
      throw new BadRequestException("Image file buffer is missing");
    }

    if (file.size === 0 || file.buffer.length === 0) {
      throw new BadRequestException("Image file is empty");
    }

    if (!SUPPORTED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw new UnsupportedMediaTypeException("Unsupported image type");
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new PayloadTooLargeException("Image must be 5MB or smaller");
    }
  }

  private normalizeTags(value?: string) {
    if (!value) {
      return [];
    }

    return [
      ...new Set(
        value
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ].slice(0, 20);
  }

  private normalizeNullableText(value?: string | null) {
    if (value === undefined) {
      return undefined;
    }

    const normalizedValue = value?.trim();

    return normalizedValue || null;
  }
}
