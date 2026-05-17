import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PermissionAction, RbacFeature } from "@prisma/client";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { BusinessGuard } from "../../business/guards/business.guard";
import { PermissionGuard } from "../../permissions/guards/permission.guard";
import { RequirePermission } from "../../permissions/decorators/require-permission.decorator";
import { SubscriptionGuard } from "../../packages/guards/subscription.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import { ProductService } from "./product.service";
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from "./dto/product.dto";

@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SubscriptionGuard, BusinessGuard, PermissionGuard)
@Controller("product-catalog/businesses/:businessId/products")
export class ProductController {
  constructor(private readonly products: ProductService) {}

  @RequirePermission(
    RbacFeature.PRODUCT_CATALOG_MANAGEMENT,
    PermissionAction.CREATE,
  )
  @Post()
  @ApiOperation({ summary: "Create product" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.products.create(user, businessId, dto);
  }

  @RequirePermission(
    RbacFeature.PRODUCT_CATALOG_MANAGEMENT,
    PermissionAction.READ,
  )
  @Get()
  @ApiOperation({ summary: "Get products" })
  findAll(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Query() query: QueryProductDto,
  ) {
    return this.products.findAll(businessId, query);
  }

  @RequirePermission(
    RbacFeature.PRODUCT_CATALOG_MANAGEMENT,
    PermissionAction.READ,
  )
  @Get(":productId")
  @ApiOperation({ summary: "Get product" })
  findOne(
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("productId", ParseUUIDPipe) productId: string,
  ) {
    return this.products.findOne(businessId, productId);
  }

  @RequirePermission(
    RbacFeature.PRODUCT_CATALOG_MANAGEMENT,
    PermissionAction.UPDATE,
  )
  @Patch(":productId")
  @ApiOperation({ summary: "Update product" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("productId", ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(user, businessId, productId, dto);
  }

  @RequirePermission(
    RbacFeature.PRODUCT_CATALOG_MANAGEMENT,
    PermissionAction.DELETE,
  )
  @Delete(":productId")
  @ApiOperation({ summary: "Delete product" })
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId", ParseUUIDPipe) businessId: string,
    @Param("productId", ParseUUIDPipe) productId: string,
  ) {
    return this.products.remove(user, businessId, productId);
  }
}
