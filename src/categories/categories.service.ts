import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StoresService } from "../stores/stores.service";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
  ) {}

  async create(userId: string, storeId: string, dto: CreateCategoryDto) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const slug = this.normalizeSlug(dto.slug || dto.name);

    await this.ensureSlugAvailable(storeId, slug);

    if (dto.parentId) {
      await this.ensureParentCategoryBelongsToStore(storeId, dto.parentId);
    }

    try {
      return await this.prisma.category.create({
        data: {
          storeId,
          name: dto.name,
          slug,
          parentId: dto.parentId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(userId: string, storeId: string, query: CategoryQueryDto) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const where: Prisma.CategoryWhereInput = {
      storeId,
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
        ],
      }),
    };

    return this.prisma.category.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, storeId: string, categoryId: string) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        storeId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async update(
    userId: string,
    storeId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    await this.ensureCategoryBelongsToStore(storeId, categoryId);

    let slug: string | undefined;

    if (dto.slug) {
      slug = this.normalizeSlug(dto.slug);
      await this.ensureSlugAvailable(storeId, slug, categoryId);
    }

    if (dto.parentId) {
      if (dto.parentId === categoryId) {
        throw new BadRequestException("Category cannot be its own parent");
      }

      await this.ensureParentCategoryBelongsToStore(storeId, dto.parentId);
    }

    try {
      return await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(slug !== undefined && { slug }),
          ...(dto.parentId !== undefined && { parentId: dto.parentId }),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(userId: string, storeId: string, categoryId: string) {
    // await this.storesService.assertStoreOwner(userId, storeId);

    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        storeId,
      },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category._count.children > 0) {
      throw new BadRequestException(
        "Cannot delete category with subcategories",
      );
    }

    if (category._count.products > 0) {
      throw new BadRequestException("Cannot delete category with products");
    }

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return {
      message: "Category deleted successfully",
    };
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
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  private async ensureParentCategoryBelongsToStore(
    storeId: string,
    parentId: string,
  ) {
    const parent = await this.prisma.category.findFirst({
      where: {
        id: parentId,
        storeId,
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      throw new BadRequestException("Parent category does not belong to store");
    }

    return parent;
  }

  private async ensureSlugAvailable(
    storeId: string,
    slug: string,
    ignoreCategoryId?: string,
  ) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        storeId,
        slug,
        ...(ignoreCategoryId && {
          NOT: {
            id: ignoreCategoryId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingCategory) {
      throw new ConflictException("Category slug already exists");
    }
  }

  private normalizeSlug(value: string) {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new BadRequestException("Invalid category slug");
    }

    return slug;
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Category slug already exists");
    }

    throw error;
  }
}
