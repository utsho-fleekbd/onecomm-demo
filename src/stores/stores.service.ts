import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, StoreStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { StoreQueryDto } from "./dto/store-query.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateStoreDto) {
    const slug = this.normalizeSlug(dto.slug || dto.name);

    await this.ensureSlugAvailable(userId, slug);

    try {
      return await this.prisma.store.create({
        data: {
          ownerId: userId,
          name: dto.name,
          slug,
          phone: dto.phone,
          address: dto.address,
          status: StoreStatus.ACTIVE,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(userId: string, query: StoreQueryDto) {
    const where: Prisma.StoreWhereInput = {
      ownerId: userId,
      ...(query.status && {
        status: query.status,
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
            phone: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.store.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            roles: true,
            members: true,
            products: true,
            categories: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
      include: {
        _count: {
          select: {
            roles: true,
            members: true,
            products: true,
            categories: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException("Store not found");
    }

    return store;
  }

  async update(userId: string, storeId: string, dto: UpdateStoreDto) {
    await this.assertStoreOwner(userId, storeId);

    let slug: string | undefined;

    if (dto.slug) {
      slug = this.normalizeSlug(dto.slug);

      await this.ensureSlugAvailable(userId, slug, storeId);
    }

    const data: Prisma.StoreUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(slug !== undefined && { slug }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.address !== undefined && { address: dto.address }),
    };

    try {
      return await this.prisma.store.update({
        where: {
          id: storeId,
        },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(userId: string, storeId: string) {
    await this.assertStoreOwner(userId, storeId);

    await this.prisma.store.delete({
      where: {
        id: storeId,
      },
    });

    return {
      message: "Store deleted successfully",
    };
  }

  async assertStoreOwner(userId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!store) {
      throw new ForbiddenException("You do not have access to this store");
    }

    return store;
  }

  private async ensureSlugAvailable(
    userId: string,
    slug: string,
    ignoreStoreId?: string,
  ) {
    const existingStore = await this.prisma.store.findFirst({
      where: {
        ownerId: userId,
        slug,
        ...(ignoreStoreId && {
          NOT: {
            id: ignoreStoreId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingStore) {
      throw new ConflictException("Store slug already exists");
    }
  }

  private normalizeSlug(value: string) {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new ConflictException("Invalid store slug");
    }

    return slug;
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Store slug already exists");
    }

    throw error;
  }
}
