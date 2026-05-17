import {
  BadRequestException,
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
import {
  apiResponse,
  paginatedResponse,
} from "../../../common/utils/api-response.util";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import { ProductCatalogLookupService } from "../common/product-catalog-lookup.service";
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from "./dto/product.dto";

const PRODUCT_INCLUDE = {
  category: true,
  brand: true,
  unit: true,
  tags: { include: { tag: true } },
  images: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
  attributes: {
    where: { deletedAt: null },
    include: { values: { where: { deletedAt: null } } },
  },
  variants: {
    where: { deletedAt: null },
    include: {
      attributes: { include: { attribute: true, attributeValue: true } },
      images: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
    },
  },
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lookup: ProductCatalogLookupService,
  ) {}

  async create(
    currentUser: CurrentUserPayload,
    businessId: string,
    dto: CreateProductDto,
  ) {
    await this.lookup.assertProductReferences(businessId, dto);
    await Promise.all([
      this.lookup.assertSkuAvailable(businessId, dto.sku),
      this.lookup.assertBarcodeAvailable(businessId, dto.barcode),
    ]);

    const tagIds = await this.lookup.assertTagsExist(businessId, dto.tagIds);
    const slug = await this.lookup.generateUniqueProductSlug(
      businessId,
      dto.name,
    );

    try {
      const product = await this.prisma.product.create({
        data: {
          businessId,
          categoryId: dto.categoryId ?? null,
          brandId: dto.brandId ?? null,
          unitId: dto.unitId ?? null,
          name: this.lookup.normalizeName(dto.name),
          slug,
          description: this.lookup.normalizeNullableText(dto.description),
          sku: this.lookup.normalizeNullableText(dto.sku),
          barcode: this.lookup.normalizeNullableText(dto.barcode),
          hasVariants: dto.hasVariants ?? false,
          price: dto.price ?? 0,
          status: dto.status ?? CatalogProductStatus.DRAFT,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          tags: this.buildTagCreate(tagIds),
          images: this.buildImageCreate(businessId, currentUser.id, dto.images),
        },
        include: PRODUCT_INCLUDE,
      });

      return apiResponse(product, "Product created successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Product SKU, barcode, or slug already exists",
      );
    }
  }

  async findAll(businessId: string, query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      businessId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.brandId ? { brandId: query.brandId } : {}),
      ...(query.tagId ? { tags: { some: { tagId: query.tagId } } } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { slug: { contains: query.search, mode: "insensitive" } },
              { sku: { contains: query.search, mode: "insensitive" } },
              { barcode: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: query.sortOrder ?? "desc" },
        include: PRODUCT_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(businessId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId, deletedAt: null },
      include: PRODUCT_INCLUDE,
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return apiResponse(product);
  }

  async update(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    dto: UpdateProductDto,
  ) {
    await this.lookup.assertProductExists(businessId, productId);
    await this.lookup.assertProductReferences(businessId, dto);

    await Promise.all([
      this.lookup.assertSkuAvailable(businessId, dto.sku, { productId }),
      this.lookup.assertBarcodeAvailable(businessId, dto.barcode, {
        productId,
      }),
      this.assertCanChangeVariantMode(businessId, productId, dto.hasVariants),
    ]);

    const tagIds =
      dto.tagIds !== undefined
        ? await this.lookup.assertTagsExist(businessId, dto.tagIds)
        : undefined;

    try {
      const product = await this.prisma.$transaction(async (tx) => {
        if (tagIds !== undefined) {
          await tx.productTagMap.deleteMany({ where: { productId } });
        }

        if (dto.images !== undefined) {
          await tx.productImage.updateMany({
            where: { productId, deletedAt: null },
            data: { deletedAt: new Date(), updatedBy: currentUser.id },
          });
        }

        return tx.product.update({
          where: { id: productId },
          data: {
            ...(dto.categoryId !== undefined && {
              categoryId: dto.categoryId ?? null,
            }),
            ...(dto.brandId !== undefined && { brandId: dto.brandId ?? null }),
            ...(dto.unitId !== undefined && { unitId: dto.unitId ?? null }),
            ...(dto.name !== undefined && {
              name: this.lookup.normalizeName(dto.name),
            }),
            ...(dto.description !== undefined && {
              description: this.lookup.normalizeNullableText(dto.description),
            }),
            ...(dto.sku !== undefined && {
              sku: this.lookup.normalizeNullableText(dto.sku),
            }),
            ...(dto.barcode !== undefined && {
              barcode: this.lookup.normalizeNullableText(dto.barcode),
            }),
            ...(dto.hasVariants !== undefined && {
              hasVariants: dto.hasVariants,
            }),
            ...(dto.price !== undefined && { price: dto.price }),
            ...(dto.status !== undefined && { status: dto.status }),
            updatedBy: currentUser.id,
            ...(tagIds !== undefined && { tags: this.buildTagCreate(tagIds) }),
            ...(dto.images !== undefined && {
              images: this.buildImageCreate(
                businessId,
                currentUser.id,
                dto.images,
              ),
            }),
          },
          include: PRODUCT_INCLUDE,
        });
      });

      return apiResponse(product, "Product updated successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Product SKU, barcode, or slug already exists",
      );
    }
  }

  async remove(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
  ) {
    await this.lookup.assertProductExists(businessId, productId);

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          status: CatalogProductStatus.ARCHIVED,
          deletedAt: new Date(),
          updatedBy: currentUser.id,
        },
      });

      await tx.productVariant.updateMany({
        where: { productId, deletedAt: null },
        data: { deletedAt: new Date(), updatedBy: currentUser.id },
      });
    });

    return apiResponse(null, "Product deleted successfully");
  }

  private buildTagCreate(tagIds: string[] = []) {
    return tagIds.length > 0
      ? { create: tagIds.map((tagId) => ({ tagId })) }
      : undefined;
  }

  private buildImageCreate(
    businessId: string,
    userId: string,
    images: { imageUrl: string; altText?: string }[] = [],
  ) {
    return images.length > 0
      ? {
          create: images.map((image, index) => ({
            businessId,
            imageUrl: image.imageUrl.trim(),
            altText: this.lookup.normalizeNullableText(image.altText),
            sortOrder: index,
            isThumbnail: index === 0,
            createdBy: userId,
            updatedBy: userId,
          })),
        }
      : undefined;
  }

  private async assertCanChangeVariantMode(
    businessId: string,
    productId: string,
    hasVariants?: boolean,
  ) {
    if (hasVariants === undefined) {
      return;
    }

    if (hasVariants) {
      const productAttributeCount = await this.prisma.productAttribute.count({
        where: {
          businessId,
          productId,
          scope: ProductAttributeScope.PRODUCT,
          deletedAt: null,
          status: ProductSimpleStatus.ACTIVE,
        },
      });

      if (productAttributeCount > 0) {
        throw new BadRequestException(
          "Remove product-level attributes before enabling variants",
        );
      }

      return;
    }

    const [variantCount, variantAttributeCount] = await Promise.all([
      this.prisma.productVariant.count({
        where: { businessId, productId, deletedAt: null },
      }),
      this.prisma.productAttribute.count({
        where: {
          businessId,
          productId,
          scope: ProductAttributeScope.VARIANT,
          deletedAt: null,
          status: ProductSimpleStatus.ACTIVE,
        },
      }),
    ]);

    if (variantCount > 0 || variantAttributeCount > 0) {
      throw new BadRequestException(
        "Remove variants and variant attributes before disabling variants",
      );
    }
  }
}
