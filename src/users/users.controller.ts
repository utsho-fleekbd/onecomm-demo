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
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores/:storeId/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create user under store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(user.id, storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get store users" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Query() query: UserQueryDto,
  ) {
    return this.usersService.findAll(user.id, storeId, query);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get store user details" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "userId", example: "user-uuid" })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("userId") userId: string,
  ) {
    return this.usersService.findOne(user.id, storeId, userId);
  }

  @Patch(":userId")
  @ApiOperation({ summary: "Update store user" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "userId", example: "user-uuid" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("userId") userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, storeId, userId, dto);
  }

  @Delete(":userId")
  @ApiOperation({ summary: "Remove user from store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  @ApiParam({ name: "userId", example: "user-uuid" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("userId") userId: string,
  ) {
    return this.usersService.remove(user.id, storeId, userId);
  }
}
