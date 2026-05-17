import { Module } from "@nestjs/common";

import { BusinessModule } from "../business/business.module";
import { PackageModule } from "../packages/package.module";
import { PermissionModule } from "../permissions/permission.module";
import { ProductAttributeController } from "./attributes/product-attribute.controller";
import { ProductAttributeService } from "./attributes/product-attribute.service";
import { ProductBrandController } from "./brands/product-brand.controller";
import { ProductBrandService } from "./brands/product-brand.service";
import { ProductCategoryController } from "./categories/product-category.controller";
import { ProductCategoryService } from "./categories/product-category.service";
import { ProductCatalogLookupService } from "./common/product-catalog-lookup.service";
import { ProductController } from "./products/product.controller";
import { ProductService } from "./products/product.service";
import { ProductTagController } from "./tags/product-tag.controller";
import { ProductTagService } from "./tags/product-tag.service";
import { ProductUnitController } from "./units/product-unit.controller";
import { ProductUnitService } from "./units/product-unit.service";
import { ProductVariantController } from "./variants/product-variant.controller";
import { ProductVariantService } from "./variants/product-variant.service";

@Module({
  imports: [BusinessModule, PermissionModule, PackageModule],
  controllers: [
    ProductCategoryController,
    ProductBrandController,
    ProductUnitController,
    ProductTagController,
    ProductController,
    ProductAttributeController,
    ProductVariantController,
  ],
  providers: [
    ProductCatalogLookupService,
    ProductCategoryService,
    ProductBrandService,
    ProductUnitService,
    ProductTagService,
    ProductService,
    ProductAttributeService,
    ProductVariantService,
  ],
  exports: [
    ProductCatalogLookupService,
    ProductCategoryService,
    ProductBrandService,
    ProductUnitService,
    ProductTagService,
    ProductService,
    ProductAttributeService,
    ProductVariantService,
  ],
})
export class ProductCatalogModule {}
