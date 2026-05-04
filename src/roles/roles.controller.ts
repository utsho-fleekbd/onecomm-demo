import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleQueryDto } from "./dto/role-query.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores/:storeId/roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: "Create role under store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Body() dto: CreateRoleDto,
  ) {
    return this.rolesService.create(user.id, storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get store roles" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Query() query: RoleQueryDto,
  ) {
    return this.rolesService.findAll(user.id, storeId, query);
  }

  @Get(":roleId")
  @ApiOperation({ summary: "Get role details" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "roleId", example: "role-uuid" })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("roleId") roleId: string,
  ) {
    return this.rolesService.findOne(user.id, storeId, roleId);
  }

  @Patch(":roleId")
  @ApiOperation({ summary: "Update role" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "roleId", example: "role-uuid" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("roleId") roleId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(user.id, storeId, roleId, dto);
  }

  @Delete(":roleId")
  @ApiOperation({ summary: "Delete role" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "roleId", example: "role-uuid" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("roleId") roleId: string,
  ) {
    return this.rolesService.remove(user.id, storeId, roleId);
  }
}
