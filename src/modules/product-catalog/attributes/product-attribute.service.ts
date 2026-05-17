import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Prisma,
  ProductAttributeScope,
  ProductSimpleStatus,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { apiResponse } from "../../../common/utils/api-response.util";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import { ProductCatalogLookupService } from "../common/product-catalog-lookup.service";
import {
  CreateProductAttributeDto,
  CreateProductAttributeValueDto,
  UpdateProductAttributeDto,
  UpdateProductAttributeValueDto,
} from "./dto/product-attribute.dto";

const ATTRIBUTE_INCLUDE = {
  values: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.ProductAttributeInclude;

@Injectable()
export class ProductAttributeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lookup: ProductCatalogLookupService,
  ) {}

  async create(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    dto: CreateProductAttributeDto,
  ) {
    const product = await this.lookup.assertProductExists(
      businessId,
      productId,
    );
    this.assertScopeMatchesProductMode(product.hasVariants, dto.scope);

    try {
      const attribute = await this.prisma.productAttribute.create({
        data: {
          businessId,
          productId,
          name: this.lookup.normalizeName(dto.name),
          scope: dto.scope,
          status: dto.status ?? ProductSimpleStatus.ACTIVE,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          values: dto.values?.length
            ? {
                create: dto.values.map((value) => ({
                  businessId,
                  name: this.lookup.normalizeName(value.name),
                  createdBy: currentUser.id,
                  updatedBy: currentUser.id,
                })),
              }
            : undefined,
        },
        include: ATTRIBUTE_INCLUDE,
      });

      return apiResponse(attribute, "Product attribute created successfully");
    } catch (error) {
      this.lookup.handleUniqueError(error, "Product attribute already exists");
    }
  }

  async findAll(businessId: string, productId: string) {
    await this.lookup.assertProductExists(businessId, productId);

    const attributes = await this.prisma.productAttribute.findMany({
      where: {
        businessId,
        productId,
        deletedAt: null,
      },
      include: ATTRIBUTE_INCLUDE,
      orderBy: { createdAt: "asc" },
    });

    return apiResponse(attributes);
  }

  async update(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    attributeId: string,
    dto: UpdateProductAttributeDto,
  ) {
    const attribute = await this.findAttributeOrThrow(
      businessId,
      productId,
      attributeId,
    );

    if (dto.scope !== undefined && dto.scope !== attribute.scope) {
      const product = await this.lookup.assertProductExists(
        businessId,
        productId,
      );
      this.assertScopeMatchesProductMode(product.hasVariants, dto.scope);
    }

    try {
      const updatedAttribute = await this.prisma.productAttribute.update({
        where: { id: attributeId },
        data: {
          ...(dto.name !== undefined && {
            name: this.lookup.normalizeName(dto.name),
          }),
          ...(dto.scope !== undefined && { scope: dto.scope }),
          ...(dto.status !== undefined && { status: dto.status }),
          updatedBy: currentUser.id,
        },
        include: ATTRIBUTE_INCLUDE,
      });

      return apiResponse(
        updatedAttribute,
        "Product attribute updated successfully",
      );
    } catch (error) {
      this.lookup.handleUniqueError(error, "Product attribute already exists");
    }
  }

  async remove(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    attributeId: string,
  ) {
    await this.findAttributeOrThrow(businessId, productId, attributeId);

    await this.prisma.productAttribute.update({
      where: { id: attributeId },
      data: {
        status: ProductSimpleStatus.INACTIVE,
        deletedAt: new Date(),
        updatedBy: currentUser.id,
        values: {
          updateMany: {
            where: { deletedAt: null },
            data: { deletedAt: new Date(), updatedBy: currentUser.id },
          },
        },
      },
    });

    return apiResponse(null, "Product attribute deleted successfully");
  }

  async createValue(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    attributeId: string,
    dto: CreateProductAttributeValueDto,
  ) {
    await this.findAttributeOrThrow(businessId, productId, attributeId);

    try {
      const value = await this.prisma.productAttributeValue.create({
        data: {
          businessId,
          attributeId,
          name: this.lookup.normalizeName(dto.name),
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      });

      return apiResponse(value, "Product attribute value created successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Product attribute value already exists",
      );
    }
  }

  async updateValue(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    attributeId: string,
    valueId: string,
    dto: UpdateProductAttributeValueDto,
  ) {
    await this.findValueOrThrow(businessId, productId, attributeId, valueId);

    try {
      const value = await this.prisma.productAttributeValue.update({
        where: { id: valueId },
        data: {
          ...(dto.name !== undefined && {
            name: this.lookup.normalizeName(dto.name),
          }),
          updatedBy: currentUser.id,
        },
      });

      return apiResponse(value, "Product attribute value updated successfully");
    } catch (error) {
      this.lookup.handleUniqueError(
        error,
        "Product attribute value already exists",
      );
    }
  }

  async removeValue(
    currentUser: CurrentUserPayload,
    businessId: string,
    productId: string,
    attributeId: string,
    valueId: string,
  ) {
    await this.findValueOrThrow(businessId, productId, attributeId, valueId);

    await this.prisma.productAttributeValue.update({
      where: { id: valueId },
      data: {
        deletedAt: new Date(),
        updatedBy: currentUser.id,
      },
    });

    return apiResponse(null, "Product attribute value deleted successfully");
  }

  private async findAttributeOrThrow(
    businessId: string,
    productId: string,
    attributeId: string,
  ) {
    const attribute = await this.prisma.productAttribute.findFirst({
      where: { id: attributeId, businessId, productId, deletedAt: null },
    });

    if (!attribute) {
      throw new NotFoundException("Product attribute not found");
    }

    return attribute;
  }

  private async findValueOrThrow(
    businessId: string,
    productId: string,
    attributeId: string,
    valueId: string,
  ) {
    await this.findAttributeOrThrow(businessId, productId, attributeId);

    const value = await this.prisma.productAttributeValue.findFirst({
      where: { id: valueId, businessId, attributeId, deletedAt: null },
    });

    if (!value) {
      throw new NotFoundException("Product attribute value not found");
    }

    return value;
  }

  private assertScopeMatchesProductMode(
    hasVariants: boolean,
    scope: ProductAttributeScope,
  ) {
    if (hasVariants && scope === ProductAttributeScope.PRODUCT) {
      throw new BadRequestException(
        "Products with variants must use variant attributes",
      );
    }

    if (!hasVariants && scope === ProductAttributeScope.VARIANT) {
      throw new BadRequestException(
        "Simple products must use product attributes",
      );
    }
  }
}
