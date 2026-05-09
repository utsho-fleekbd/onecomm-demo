import { PermissionAction, RbacFeature } from "@prisma/client";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { BusinessService } from "./business.service";
import { QueryBusinessDto } from "./dto/query-business.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { BusinessGuard } from "./guards/business.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import { RequirePermission } from "../permissions/decorators/require-permission.decorator";
import { PermissionGuard } from "../permissions/guards/permission.guard";

@ApiTags("Business")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessGuard, PermissionGuard)
@Controller("businesses")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @RequirePermission(RbacFeature.BUSINESS_PROFILE, PermissionAction.CREATE)
  @Post()
  @ApiOperation({ summary: "Create business" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateBusinessDto,
  ) {
    return this.businessService.create(user.id, user.type, dto);
  }

  @RequirePermission(RbacFeature.BUSINESS_PROFILE, PermissionAction.READ)
  @Get()
  @ApiOperation({ summary: "Get businesses" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryBusinessDto,
  ) {
    return this.businessService.findAll(user, query);
  }

  @RequirePermission(RbacFeature.BUSINESS_PROFILE, PermissionAction.READ)
  @Get(":businessId")
  @ApiOperation({ summary: "Get business details" })
  @ApiParam({ name: "businessId", example: 1 })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
  ) {
    return this.businessService.findOne(user, businessId);
  }

  @RequirePermission(RbacFeature.BUSINESS_PROFILE, PermissionAction.UPDATE)
  @Patch(":businessId")
  @ApiOperation({ summary: "Update business" })
  @ApiParam({ name: "businessId", example: 1 })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessService.update(user, businessId, dto);
  }

  @RequirePermission(RbacFeature.BUSINESS_PROFILE, PermissionAction.DELETE)
  @Delete(":businessId")
  @ApiOperation({ summary: "Delete business" })
  @ApiParam({ name: "businessId", example: 1 })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
  ) {
    return this.businessService.remove(user, businessId);
  }
}
