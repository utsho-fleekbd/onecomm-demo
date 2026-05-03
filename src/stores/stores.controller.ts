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
import { CreateStoreDto } from "./dto/create-store.dto";
import { StoreQueryDto } from "./dto/store-query.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { StoresService } from "./stores.service";

@ApiTags("Stores")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores")
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: "Create store" })
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateStoreDto) {
    return this.storesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get my stores" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: StoreQueryDto,
  ) {
    return this.storesService.findAll(user.id, query);
  }

  @Get(":storeId")
  @ApiOperation({ summary: "Get store details" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
  ) {
    return this.storesService.findOne(user.id, storeId);
  }

  @Patch(":storeId")
  @ApiOperation({ summary: "Update store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storesService.update(user.id, storeId, dto);
  }

  @Delete(":storeId")
  @ApiOperation({ summary: "Delete store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
  ) {
    return this.storesService.remove(user.id, storeId);
  }
}
