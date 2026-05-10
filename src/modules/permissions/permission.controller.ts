import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { PermissionAction, RbacFeature } from "@prisma/client";
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

import { PermissionGuard } from "./guards/permission.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BusinessGuard } from "../business/guards/business.guard";

import { AddPermissionDto } from "./dto/add-permission";
import { PermissionService } from "./permission.service";
import { QueryPermissionDto } from "./dto/query-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@ApiTags("Permissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessGuard, PermissionGuard)
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
    @Param("businessId", ParseIntPipe) businessId: number,
    @Query() query: QueryPermissionDto,
  ) {
    return this.permissionsService.findAll(businessId, query);
  }

  @Get("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Get permissions of a specific role",
  })
  findByRole(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
  ) {
    return this.permissionsService.findByRole(businessId, roleId);
  }

  @Post("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Add permissions to a role",
  })
  addToRole(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: AddPermissionDto,
  ) {
    return this.permissionsService.addToRole(businessId, roleId, dto);
  }

  @Put("businesses/:businessId/roles/:roleId")
  @ApiOperation({
    summary: "Replace all permissions of a role",
    description:
      "This removes old permissions first, then inserts the new permission list.",
  })
  replaceRolePermissions(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.replaceRolePermissions(
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
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Param("feature", new ParseEnumPipe(RbacFeature)) feature: RbacFeature,
    @Param("action", new ParseEnumPipe(PermissionAction))
    action: PermissionAction,
  ) {
    return this.permissionsService.removeFromRole(
      businessId,
      roleId,
      feature,
      action,
    );
  }
}
