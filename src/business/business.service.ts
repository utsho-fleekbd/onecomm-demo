import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BusinessStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { QueryBusinessDto } from "./dto/query-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { CreateBusinessDto } from "./dto/create-business.dto";

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateBusinessDto) {
    const slug = this.normalizeSlug(dto.slug || dto.name);

    await this.ensureSlugAvailable(userId, slug);

    try {
      return await this.prisma.business.create({
        data: {
          ownerUserId: userId,
          name: dto.name,
          slug,
          phone: dto.phone,
          address: dto.address,
          status: BusinessStatus.ACTIVE,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(userId: number, query: QueryBusinessDto) {
    const where: Prisma.BusinessWhereInput = {
      ownerUserId: userId,
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

    return this.prisma.business.findMany({
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

  async findOne(businessId: number) {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
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

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  async update(userId: number, businessId: number, dto: UpdateBusinessDto) {
    let slug: string | undefined;

    if (dto.slug) {
      slug = this.normalizeSlug(dto.slug);

      await this.ensureSlugAvailable(userId, slug);
    }

    const data: Prisma.BusinessUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(slug !== undefined && { slug }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.address !== undefined && { address: dto.address }),
    };

    try {
      return await this.prisma.business.update({
        where: {
          id: businessId,
        },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(businessId: number) {
    await this.prisma.business.delete({
      where: {
        id: businessId,
      },
    });

    return {
      message: "Business deleted successfully",
    };
  }

  private async ensureSlugAvailable(userId: number, slug: string) {
    const existingBusiness = await this.prisma.business.findFirst({
      where: {
        ownerUserId: userId,
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingBusiness) {
      throw new ConflictException("Business slug already exists");
    }
  }

  private normalizeSlug(value: string) {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new ConflictException("Invalid business slug");
    }

    return slug;
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Business slug already exists");
    }

    throw error;
  }
}
