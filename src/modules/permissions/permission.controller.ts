import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { PermissionAction, RbacFeature } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

import { AddPermissionDto } from "./dto/add-permission";
import { PermissionService } from "./permission.service";
import { QueryPermissionDto } from "./dto/query-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@ApiTags("Permissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("permissions")
export class PermissionController {
  constructor(private readonly permissionsService: PermissionService) {}

  @Get("available")
  @ApiOperation({
    summary: "Get all available RBAC features and actions",
  })
  getAvailablePermissions() {
    return this.permissionsService.getAvailablePermissions();
  }

  @Get("businesses/:businessId")
  @ApiOperation({
    summary: "Get all role permissions for a business",
  })
  findAll(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Query() query: QueryPermissionDto,
  ) {
    return this.permissionsService.findAll(currentUser, businessId, query);
  }

  @Get("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Get permissions of a specific role",
  })
  findByRole(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
  ) {
    return this.permissionsService.findByRole(currentUser, businessId, roleId);
  }

  @Post("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Add permissions to a role",
  })
  addToRole(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: AddPermissionDto,
  ) {
    return this.permissionsService.addToRole(
      currentUser,
      businessId,
      roleId,
      dto,
    );
  }

  @Put("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Replace all permissions of a role",
    description:
      "This removes old permissions first, then inserts the new permission list.",
  })
  replaceRolePermissions(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.replaceRolePermissions(
      currentUser,
      businessId,
      roleId,
      dto,
    );
  }

  @Delete("businesses/:businessId/roles/:roleId/:feature/:action")
  @ApiOperation({
    summary: "Remove a single permission from a role",
  })
  @ApiParam({
    name: "feature",
    enum: RbacFeature,
  })
  @ApiParam({
    name: "action",
    enum: PermissionAction,
  })
  removeFromRole(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Param("feature", new ParseEnumPipe(RbacFeature)) feature: RbacFeature,
    @Param("action", new ParseEnumPipe(PermissionAction))
    action: PermissionAction,
  ) {
    return this.permissionsService.removeFromRole(
      currentUser,
      businessId,
      roleId,
      feature,
      action,
    );
  }
}
