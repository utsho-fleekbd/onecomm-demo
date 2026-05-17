import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CatalogProductStatus,
  Prisma,
  ProductAttributeScope,
  ProductSimpleStatus,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { generateRandomSlug } from "../../../common/utils/slug-generator.util";

const PRODUCT_SLUG_MAX_LENGTH = 220;
const PRODUCT_SLUG_RETRY_LIMIT = 5;

@Injectable()
export class ProductCatalogLookupService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCategoryNameAvailable(
    businessId: string,
    name: string,
    parentId?: string | null,
    excludeCategoryId?: string,
  ) {
    const category = await this.prisma.productCategory.findFirst({
      where: {
        businessId,
        name: this.normalizeName(name),
        parentId: parentId ?? null,
        deletedAt: null,
        ...(excludeCategoryId ? { id: { not: excludeCategoryId } } : {}),
      },
      select: { id: true },
    });

    if (category) {
      throw new ConflictException(
        "Category name already exists for this parent",
      );
    }
  }

  async assertCategoryParent(
    businessId: string,
    parentId?: string | null,
    categoryId?: string,
  ) {
    if (!parentId) {
      return null;
    }

    if (categoryId && parentId === categoryId) {
      throw new BadRequestException("Category cannot be its own parent");
    }

    const parent = await this.prisma.productCategory.findFirst({
      where: {
        id: parentId,
        businessId,
        deletedAt: null,
      },
      select: {
        id: true,
        parentId: true,
      },
    });

    if (!parent) {
      throw new NotFoundException("Parent category not found");
    }

    if (categoryId) {
      await this.assertCategoryParentDoesNotCreateCycle(
        businessId,
        categoryId,
        parent.parentId,
      );
    }

    return parent;
  }

  async assertProductReferences(
    businessId: string,
    params: {
      categoryId?: string | null;
      brandId?: string | null;
      unitId?: string | null;
    },
  ) {
    const checks: Promise<unknown>[] = [];

    if (params.categoryId) {
      checks.push(this.assertCategoryExists(businessId, params.categoryId));
    }

    if (params.brandId) {
      checks.push(this.assertBrandExists(businessId, params.brandId));
    }

    if (params.unitId) {
      checks.push(this.assertUnitExists(businessId, params.unitId));
    }

    await Promise.all(checks);
  }

  async assertTagsExist(businessId: string, tagIds: string[] = []) {
    const uniqueTagIds = [...new Set(tagIds)];

    if (uniqueTagIds.length === 0) {
      return uniqueTagIds;
    }

    const count = await this.prisma.productTag.count({
      where: {
        businessId,
        id: { in: uniqueTagIds },
        deletedAt: null,
        status: ProductSimpleStatus.ACTIVE,
      },
    });

    if (count !== uniqueTagIds.length) {
      throw new BadRequestException("One or more product tags are invalid");
    }

    return uniqueTagIds;
  }

  async assertProductExists(businessId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
        deletedAt: null,
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async assertVariantExists(
    businessId: string,
    productId: string,
    variantId: string,
  ) {
    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id: variantId,
        businessId,
        productId,
        deletedAt: null,
      },
    });

    if (!variant) {
      throw new NotFoundException("Product variant not found");
    }

    return variant;
  }

  async assertSkuAvailable(
    businessId: string,
    sku?: string | null,
    exclude?: { productId?: string; variantId?: string },
  ) {
    const normalizedSku = this.normalizeNullableText(sku);

    if (!normalizedSku) {
      return;
    }

    const [product, variant] = await Promise.all([
      this.prisma.product.findFirst({
        where: {
          businessId,
          sku: normalizedSku,
          deletedAt: null,
          ...(exclude?.productId ? { id: { not: exclude.productId } } : {}),
        },
        select: { id: true },
      }),
      this.prisma.productVariant.findFirst({
        where: {
          businessId,
          sku: normalizedSku,
          deletedAt: null,
          ...(exclude?.variantId ? { id: { not: exclude.variantId } } : {}),
        },
        select: { id: true },
      }),
    ]);

    if (product || variant) {
      throw new ConflictException("SKU already exists for this business");
    }
  }

  async assertBarcodeAvailable(
    businessId: string,
    barcode?: string | null,
    exclude?: { productId?: string; variantId?: string },
  ) {
    const normalizedBarcode = this.normalizeNullableText(barcode);

    if (!normalizedBarcode) {
      return;
    }

    const [product, variant] = await Promise.all([
      this.prisma.product.findFirst({
        where: {
          businessId,
          barcode: normalizedBarcode,
          deletedAt: null,
          ...(exclude?.productId ? { id: { not: exclude.productId } } : {}),
        },
        select: { id: true },
      }),
      this.prisma.productVariant.findFirst({
        where: {
          businessId,
          barcode: normalizedBarcode,
          deletedAt: null,
          ...(exclude?.variantId ? { id: { not: exclude.variantId } } : {}),
        },
        select: { id: true },
      }),
    ]);

    if (product || variant) {
      throw new ConflictException("Barcode already exists for this business");
    }
  }

  async generateUniqueProductSlug(
    businessId: string,
    name: string,
    excludeProductId?: string,
  ) {
    for (let attempt = 0; attempt < PRODUCT_SLUG_RETRY_LIMIT; attempt++) {
      const slug = generateRandomSlug(name, {
        fallback: "product",
        maxLength: PRODUCT_SLUG_MAX_LENGTH,
      });

      const existingProduct = await this.prisma.product.findFirst({
        where: {
          businessId,
          slug,
          deletedAt: null,
          ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
        },
        select: {
          id: true,
        },
      });

      if (!existingProduct) {
        return slug;
      }
    }

    throw new ConflictException("Could not generate a unique product slug");
  }

  async assertAttributeValuePairs(
    businessId: string,
    productId: string,
    pairs: { attributeId: string; attributeValueId: string }[] = [],
  ) {
    const normalizedPairs = [
      ...new Map(pairs.map((pair) => [pair.attributeId, pair])).values(),
    ];

    for (const pair of normalizedPairs) {
      const attribute = await this.prisma.productAttribute.findFirst({
        where: {
          id: pair.attributeId,
          businessId,
          productId,
          scope: ProductAttributeScope.VARIANT,
          deletedAt: null,
          status: ProductSimpleStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      });

      if (!attribute) {
        throw new BadRequestException(
          "One or more variant attributes are invalid",
        );
      }

      const value = await this.prisma.productAttributeValue.findFirst({
        where: {
          id: pair.attributeValueId,
          businessId,
          attributeId: pair.attributeId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!value) {
        throw new BadRequestException(
          "One or more variant attribute values are invalid",
        );
      }
    }

    return normalizedPairs;
  }

  normalizeName(value: string) {
    return value.trim();
  }

  normalizeNullableText(value?: string | null) {
    if (value === undefined) {
      return undefined;
    }

    const normalizedValue = value?.trim();

    return normalizedValue || null;
  }

  handleUniqueError(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException(message);
    }

    throw error;
  }

  private async assertCategoryExists(businessId: string, categoryId: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: {
        id: categoryId,
        businessId,
        deletedAt: null,
        status: ProductSimpleStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException("Category is invalid");
    }
  }

  private async assertBrandExists(businessId: string, brandId: string) {
    const brand = await this.prisma.productBrand.findFirst({
      where: {
        id: brandId,
        businessId,
        deletedAt: null,
        status: ProductSimpleStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!brand) {
      throw new BadRequestException("Brand is invalid");
    }
  }

  private async assertUnitExists(businessId: string, unitId: string) {
    const unit = await this.prisma.productUnit.findFirst({
      where: {
        id: unitId,
        businessId,
        deletedAt: null,
        status: ProductSimpleStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!unit) {
      throw new BadRequestException("Unit is invalid");
    }
  }

  private async assertCategoryParentDoesNotCreateCycle(
    businessId: string,
    categoryId: string,
    ancestorId: string | null,
  ) {
    let nextAncestorId = ancestorId;

    while (nextAncestorId) {
      if (nextAncestorId === categoryId) {
        throw new BadRequestException("Category parent would create a cycle");
      }

      const ancestor = await this.prisma.productCategory.findFirst({
        where: {
          id: nextAncestorId,
          businessId,
          deletedAt: null,
        },
        select: {
          parentId: true,
        },
      });

      nextAncestorId = ancestor?.parentId ?? null;
    }
  }
}
