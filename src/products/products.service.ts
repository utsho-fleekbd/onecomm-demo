import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ProductStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StoresService } from "../stores/stores.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
  ) {}

  async create(userId: string, storeId: string, dto: CreateProductDto) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const slug = this.normalizeSlug(dto.slug || dto.name);

    await this.ensureSlugAvailable(storeId, slug);

    if (dto.sku) {
      await this.ensureSkuAvailable(storeId, dto.sku);
    }

    if (dto.categoryId) {
      await this.ensureCategoryBelongsToStore(storeId, dto.categoryId);
    }

    try {
      return await this.prisma.product.create({
        data: {
          storeId,
          categoryId: dto.categoryId,
          name: dto.name,
          slug,
          sku: dto.sku,
          description: dto.description,
          price: new Prisma.Decimal(dto.price),
          status: dto.status ?? ProductStatus.DRAFT,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(userId: string, storeId: string, query: ProductQueryDto) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const where: Prisma.ProductWhereInput = {
      storeId,
      ...(query.status && {
        status: query.status,
      }),
      ...(query.categoryId && {
        categoryId: query.categoryId,
      }),
      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            slug: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            sku: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, storeId: string, productId: string) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async update(
    userId: string,
    storeId: string,
    productId: string,
    dto: UpdateProductDto,
  ) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    await this.ensureProductBelongsToStore(storeId, productId);

    let slug: string | undefined;

    if (dto.slug) {
      slug = this.normalizeSlug(dto.slug);
      await this.ensureSlugAvailable(storeId, slug, productId);
    }

    if (dto.sku) {
      await this.ensureSkuAvailable(storeId, dto.sku, productId);
    }

    if (dto.categoryId) {
      await this.ensureCategoryBelongsToStore(storeId, dto.categoryId);
    }

    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
          ...(dto.name !== undefined && { name: dto.name }),
          ...(slug !== undefined && { slug }),
          ...(dto.sku !== undefined && { sku: dto.sku }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.price !== undefined && {
            price: new Prisma.Decimal(dto.price),
          }),
          ...(dto.status !== undefined && { status: dto.status }),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(userId: string, storeId: string, productId: string) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    await this.ensureProductBelongsToStore(storeId, productId);

    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return {
      message: "Product deleted successfully",
    };
  }

  private async ensureProductBelongsToStore(
    storeId: string,
    productId: string,
  ) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  private async ensureCategoryBelongsToStore(
    storeId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        storeId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new BadRequestException("Category does not belong to this store");
    }

    return category;
  }

  private async ensureSlugAvailable(
    storeId: string,
    slug: string,
    ignoreProductId?: string,
  ) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        storeId,
        slug,
        ...(ignoreProductId && {
          NOT: {
            id: ignoreProductId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingProduct) {
      throw new ConflictException("Product slug already exists");
    }
  }

  private async ensureSkuAvailable(
    storeId: string,
    sku: string,
    ignoreProductId?: string,
  ) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        storeId,
        sku,
        ...(ignoreProductId && {
          NOT: {
            id: ignoreProductId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingProduct) {
      throw new ConflictException("Product SKU already exists");
    }
  }

  private normalizeSlug(value: string) {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new BadRequestException("Invalid product slug");
    }

    return slug;
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Product slug or SKU already exists");
    }

    throw error;
  }
}
