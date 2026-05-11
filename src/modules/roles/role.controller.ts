import { PermissionAction, RbacFeature } from "@prisma/client";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
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

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { BusinessGuard } from "../business/guards/business.guard";
import { PermissionGuard } from "../permissions/guards/permission.guard";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import { RequirePermission } from "../permissions/decorators/require-permission.decorator";

import { AssignRoleDto } from "./dto/assign-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { QueryRoleAssignmentsDto } from "./dto/query-role-assignment.dto";
import { QueryRoleDto } from "./dto/query-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { UpdateRoleAssignmentDto } from "./dto/update-role-assignment.dto";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessGuard, PermissionGuard)
@Controller("roles")
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.CREATE,
  )
  @Post("businesses/:businessId")
  @ApiOperation({
    summary: "Create a role for a business",
  })
  create(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Body() dto: CreateRoleDto,
  ) {
    return this.rolesService.create(currentUser, businessId, dto);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.READ,
  )
  @Get("businesses/:businessId")
  @ApiOperation({
    summary: "Get business roles",
  })
  findAll(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Query() query: QueryRoleDto,
  ) {
    return this.rolesService.findAll(currentUser, businessId, query);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.READ,
  )
  @Get("businesses/:businessId/assignments")
  @ApiOperation({
    summary: "Get role assignments of a business",
  })
  findAssignments(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Query() query: QueryRoleAssignmentsDto,
  ) {
    return this.rolesService.findAssignments(currentUser, businessId, query);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.READ,
  )
  @Get("businesses/:businessId/:roleId")
  @ApiOperation({
    summary: "Get single business role",
  })
  findOne(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
  ) {
    return this.rolesService.findOne(currentUser, businessId, roleId);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.UPDATE,
  )
  @Patch("businesses/:businessId/:roleId")
  @ApiOperation({
    summary: "Update a business role",
  })
  update(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(currentUser, businessId, roleId, dto);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.DELETE,
  )
  @Delete("businesses/:businessId/:roleId")
  @ApiOperation({
    summary: "Delete a business role",
  })
  remove(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
  ) {
    return this.rolesService.remove(currentUser, businessId, roleId);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.UPDATE,
  )
  @Post("businesses/:businessId/:roleId/assign")
  @ApiOperation({
    summary: "Assign role to user",
  })
  assignRole(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("roleId", ParseIntPipe) roleId: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.rolesService.assignRole(currentUser, businessId, roleId, dto);
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.UPDATE,
  )
  @Patch("businesses/:businessId/assignments/:assignmentId")
  @ApiOperation({
    summary: "Update role assignment",
  })
  updateAssignment(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
    @Body() dto: UpdateRoleAssignmentDto,
  ) {
    return this.rolesService.updateAssignment(
      currentUser,
      businessId,
      assignmentId,
      dto,
    );
  }

  @RequirePermission(
    RbacFeature.ROLE_PERMISSION_MANAGEMENT,
    PermissionAction.UPDATE,
  )
  @Delete("businesses/:businessId/assignments/:assignmentId")
  @ApiOperation({
    summary: "Revoke role assignment",
  })
  revokeAssignment(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
  ) {
    return this.rolesService.revokeAssignment(
      currentUser,
      businessId,
      assignmentId,
    );
  }
}
