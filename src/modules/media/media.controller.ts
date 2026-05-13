import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { PermissionAction, RbacFeature } from "@prisma/client";

import { MediaService } from "./media.service";
import { QueryMediaDto } from "./dto/query-media.dto";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { DeleteMediaBulkDto } from "./dto/delete-media.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BusinessGuard } from "../business/guards/business.guard";
import { PermissionGuard } from "../permissions/guards/permission.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermission } from "../permissions/decorators/require-permission.decorator";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import type { UploadableMediaFile } from "./uploaders/media-uploader.types";

@ApiTags("Media")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessGuard, PermissionGuard)
@Controller("media/businesses/:businessId")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("images")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.CREATE)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload image" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        altText: {
          type: "string",
          example: "Hero banner",
        },
        tags: {
          type: "string",
          example: "hero,banner,homepage",
        },
      },
    },
  })
  uploadImage(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @UploadedFile() file: UploadableMediaFile | undefined,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadImage(currentUser, businessId, file, dto);
  }

  @Post("images/bulk")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.CREATE)
  @UseInterceptors(FilesInterceptor("files"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Bulk upload images" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["files"],
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
        altText: {
          type: "string",
          example: "Product gallery image",
        },
        tags: {
          type: "string",
          example: "product,gallery",
        },
      },
    },
  })
  uploadImages(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @UploadedFiles() files: UploadableMediaFile[] | undefined,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.uploadImages(currentUser, businessId, files, dto);
  }

  @Get("images")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.READ)
  @ApiOperation({ summary: "Get business images" })
  findImages(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Query() query: QueryMediaDto,
  ) {
    return this.mediaService.findImages(businessId, query);
  }

  @Delete("images/bulk")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.DELETE)
  @ApiOperation({ summary: "Bulk delete images" })
  deleteImages(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Body() dto: DeleteMediaBulkDto,
  ) {
    return this.mediaService.deleteImages(businessId, dto);
  }

  @Delete("images/:mediaAssetId")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.DELETE)
  @ApiOperation({ summary: "Delete image" })
  deleteImage(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("mediaAssetId", ParseUUIDPipe) mediaAssetId: string,
  ) {
    return this.mediaService.deleteImage(businessId, mediaAssetId);
  }
}
