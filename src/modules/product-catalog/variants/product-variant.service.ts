import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ProductVariantStatus } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { apiResponse } from "../../../common/utils/api-response.util";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import { ProductCatalogLookupService } from "../common/product-catalog-lookup.service";
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "./dto/product-variant.dto";

const VARIANT_INCLUDE = {
  attributes: { include: { attribute: true, attributeValue: true } },
  images: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
} satisfies Prisma.ProductVariantInclude;

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lookup: ProductCatalogLookupService,
  ) {}

  async create(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    dto: CreateProductVariantDto,
  ) {
    const product = await this.lookup.assertProductExists(
      businessId,
      productId,
    );

    if (!product.hasVariants) {
      throw new BadRequestException(
        "Enable variants on this product before creating variants",
      );
    }

    await Promise.all([
      this.lookup.assertSkuAvailable(businessId, dto.sku),
      this.lookup.assertBarcodeAvailable(businessId, dto.barcode),
    ]);

    const attributes = await this.lookup.assertAttributeValuePairs(
      businessId,
      productId,
      dto.attributes,
    );

    try {
      const variant = await this.prisma.productVariant.create({
        data: {
          businessId,
          productId,
          title: this.lookup.normalizeName(dto.title),
          sku: this.lookup.normalizeNullableText(dto.sku),
          barcode: this.lookup.normalizeNullableText(dto.barcode),
          price: dto.price ?? product.price,
          weight: dto.weight ?? null,
          status: dto.status ?? ProductVariantStatus.ACTIVE,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          attributes: this.buildAttributeCreate(attributes),
          images: this.buildImageCreate(
            businessId,
            productId,
            currentUser.id,
            dto.images,
          ),
        },
        include: VARIANT_INCLUDE,
      });

      return apiResponse(variant, "Product variant created successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Variant SKU or barcode already exists",
      );
    }
  }

  async findAll(businessId: string, productId: string) {
    await this.lookup.assertProductExists(businessId, productId);

    const variants = await this.prisma.productVariant.findMany({
      where: { businessId, productId, deletedAt: null },
      include: VARIANT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return apiResponse(variants);
  }

  async findOne(businessId: string, productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, businessId, productId, deletedAt: null },
      include: VARIANT_INCLUDE,
    });

    if (!variant) {
      throw new NotFoundException("Product variant not found");
    }

    return apiResponse(variant);
  }

  async update(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    variantId: string,
    dto: UpdateProductVariantDto,
  ) {
    await this.lookup.assertVariantExists(businessId, productId, variantId);

    await Promise.all([
      this.lookup.assertSkuAvailable(businessId, dto.sku, { variantId }),
      this.lookup.assertBarcodeAvailable(businessId, dto.barcode, {
        variantId,
      }),
    ]);

    const attributes =
      dto.attributes !== undefined
        ? await this.lookup.assertAttributeValuePairs(
            businessId,
            productId,
            dto.attributes,
          )
        : undefined;

    try {
      const variant = await this.prisma.$transaction(async (tx) => {
        if (attributes !== undefined) {
          await tx.productVariantAttribute.deleteMany({ where: { variantId } });
        }

        if (dto.images !== undefined) {
          await tx.productImage.updateMany({
            where: { variantId, deletedAt: null },
            data: { deletedAt: new Date(), updatedBy: currentUser.id },
          });
        }

        return tx.productVariant.update({
          where: { id: variantId },
          data: {
            ...(dto.title !== undefined && {
              title: this.lookup.normalizeName(dto.title),
            }),
            ...(dto.sku !== undefined && {
              sku: this.lookup.normalizeNullableText(dto.sku),
            }),
            ...(dto.barcode !== undefined && {
              barcode: this.lookup.normalizeNullableText(dto.barcode),
            }),
            ...(dto.price !== undefined && { price: dto.price }),
            ...(dto.weight !== undefined && { weight: dto.weight }),
            ...(dto.status !== undefined && { status: dto.status }),
            updatedBy: currentUser.id,
            ...(attributes !== undefined && {
              attributes: this.buildAttributeCreate(attributes),
            }),
            ...(dto.images !== undefined && {
              images: this.buildImageCreate(
                businessId,
                productId,
                currentUser.id,
                dto.images,
              ),
            }),
          },
          include: VARIANT_INCLUDE,
        });
      });

      return apiResponse(variant, "Product variant updated successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Variant SKU or barcode already exists",
      );
    }
  }

  async remove(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    variantId: string,
  ) {
    await this.lookup.assertVariantExists(businessId, productId, variantId);

    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        status: ProductVariantStatus.INACTIVE,
        deletedAt: new Date(),
        updatedBy: currentUser.id,
      },
    });

    return apiResponse(null, "Product variant deleted successfully");
  }

  private buildAttributeCreate(
    attributes: { attributeId: string; attributeValueId: string }[] = [],
  ) {
    return attributes.length > 0
      ? {
          create: attributes.map((attribute) => ({
            attributeId: attribute.attributeId,
            attributeValueId: attribute.attributeValueId,
          })),
        }
      : undefined;
  }

  private buildImageCreate(
    businessId: string,
    productId: string,
    userId: string,
    images: { imageUrl: string; altText?: string }[] = [],
  ) {
    return images.length > 0
      ? {
          create: images.map((image, index) => ({
            businessId,
            productId,
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
}
