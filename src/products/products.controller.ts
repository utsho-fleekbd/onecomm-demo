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
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores/:storeId/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create product under store" })
  @ApiParam({ name: "storeId", example: "store-uuid" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(user.id, storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get store products" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findAll(user.id, storeId, query);
  }

  @Get(":productId")
  @ApiOperation({ summary: "Get product details" })
  findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
  ) {
    return this.productsService.findOne(user.id, storeId, productId);
  }

  @Patch(":productId")
  @ApiOperation({ summary: "Update product" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(user.id, storeId, productId, dto);
  }

  @Delete(":productId")
  @ApiOperation({ summary: "Delete product" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
  ) {
    return this.productsService.remove(user.id, storeId, productId);
  }
}
