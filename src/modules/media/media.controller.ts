import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
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
import { FileInterceptor } from "@nestjs/platform-express";
import { PermissionAction, RbacFeature } from "@prisma/client";

import { MediaService } from "./media.service";
import { QueryMediaDto } from "./dto/query-media.dto";
import { UploadMediaDto } from "./dto/upload-media.dto";
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

  @Get("images")
  @RequirePermission(RbacFeature.MEDIA_MANAGEMENT, PermissionAction.READ)
  @ApiOperation({ summary: "Get business images" })
  findImages(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Query() query: QueryMediaDto,
  ) {
    return this.mediaService.findImages(currentUser, businessId, query);
  }
}
