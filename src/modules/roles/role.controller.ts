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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { BusinessAccess } from "../business/guards/require-business-access.guard";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

import { AssignRoleDto } from "./dto/assign-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { QueryRoleAssignmentsDto } from "./dto/query-role-assignment.dto";
import { QueryRoleDto } from "./dto/query-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { UpdateRoleAssignmentDto } from "./dto/update-role-assignment.dto";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccess)
@Controller("roles")
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

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
