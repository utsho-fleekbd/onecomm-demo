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
import { CategoriesService } from "./categories.service";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores/:storeId/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create category under store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.id, storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get store categories" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Query() query: CategoryQueryDto,
  ) {
    return this.categoriesService.findAll(user.id, storeId, query);
  }

  @Get(":categoryId")
  @ApiOperation({ summary: "Get category details" })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("categoryId") categoryId: string,
  ) {
    return this.categoriesService.findOne(user.id, storeId, categoryId);
  }

  @Patch(":categoryId")
  @ApiOperation({ summary: "Update category" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user.id, storeId, categoryId, dto);
  }

  @Delete(":categoryId")
  @ApiOperation({ summary: "Delete category" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("categoryId") categoryId: string,
  ) {
    return this.categoriesService.remove(user.id, storeId, categoryId);
  }
}
