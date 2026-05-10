import {
  BusinessMemberStatus,
  BusinessStatus,
  Prisma,
  SystemUserType,
} from "@prisma/client";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { QueryBusinessDto } from "./dto/query-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { CreateBusinessDto } from "./dto/create-business.dto";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

const BUSINESS_INCLUDE = {
  ownerUser: {
    select: {
      id: true,
      uuid: true,
      name: true,
      email: true,
      type: true,
      status: true,
    },
  },
  settings: true,
  branding: true,
  _count: {
    select: {
      members: true,
      roles: true,
    },
  },
} satisfies Prisma.BusinessInclude;

const ACCESSIBLE_BUSINESS_STATUSES = [
  BusinessStatus.TRIAL,
  BusinessStatus.ACTIVE,
] satisfies BusinessStatus[];

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    userType: SystemUserType,
    dto: CreateBusinessDto,
    tx?: Prisma.TransactionClient,
  ) {
    if (userType !== SystemUserType.TENANT) {
      throw new ForbiddenException(
        "You do not have permission to create businesses",
      );
    }

    const client = tx ?? this.prisma;

    const slug = this.normalizeSlug(dto.slug || dto.name);

    await this.ensureSlugAvailable(slug, userId);

    const settingsData = dto.settings
      ? this.buildBusinessSettingData(dto.settings)
      : {};

    const brandingData = dto.branding
      ? this.buildBusinessBrandingData(dto.branding)
      : null;

    try {
      return await client.business.create({
        data: {
          name: dto.name.trim(),
          slug,
          email: dto.email ? this.normalizeEmail(dto.email) : null,
          phone: dto.phone?.trim() || null,
          country: dto.country?.trim() || null,
          currencyCode: dto.currencyCode?.trim().toUpperCase() || "BDT",
          timezone: dto.timezone?.trim() || "Asia/Dhaka",
          status: dto.status ?? BusinessStatus.TRIAL,

          ownerUser: {
            connect: {
              id: userId,
            },
          },

          createdBy: {
            connect: {
              id: userId,
            },
          },

          settings: {
            create: settingsData,
          },

          ...(brandingData &&
            this.hasKeys(brandingData) && {
              branding: {
                create: brandingData,
              },
            }),
        },
        include: BUSINESS_INCLUDE,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(currentUser: CurrentUserPayload, query: QueryBusinessDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const canIncludeDeleted =
      currentUser.type === SystemUserType.ADMIN && query.includeDeleted;

    const searchWhere: Prisma.BusinessWhereInput | undefined = query.search
      ? {
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
              email: {
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
            {
              country: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined;

    const statusWhere: Prisma.BusinessWhereInput =
      currentUser.type === SystemUserType.ADMIN
        ? {
            ...(query.status && {
              status: query.status,
            }),
          }
        : {
            ...(query.status
              ? {
                  AND: [
                    {
                      status: {
                        in: ACCESSIBLE_BUSINESS_STATUSES,
                      },
                    },
                    {
                      status: query.status,
                    },
                  ],
                }
              : {
                  status: {
                    in: ACCESSIBLE_BUSINESS_STATUSES,
                  },
                }),
          };

    const where: Prisma.BusinessWhereInput = {
      ...(!canIncludeDeleted && {
        deletedAt: null,
      }),

      AND: [
        this.getBusinessAccessWhere(currentUser),
        statusWhere,
        ...(searchWhere ? [searchWhere] : []),
      ],

      ...(query.country && {
        country: {
          equals: query.country,
          mode: "insensitive",
        },
      }),

      ...(query.currencyCode && {
        currencyCode: {
          equals: query.currencyCode,
          mode: "insensitive",
        },
      }),
    };

    const orderBy: Prisma.BusinessOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: BUSINESS_INCLUDE,
      }),

      this.prisma.business.count({
        where,
      }),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      items,
    };
  }

  async findOne(currentUser: CurrentUserPayload, businessId: number) {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        deletedAt: null,
        ...this.getBusinessAccessWhere(currentUser),
      },
      include: BUSINESS_INCLUDE,
    });

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  async update(
    currentUser: CurrentUserPayload,
    businessId: number,
    dto: UpdateBusinessDto,
  ) {
    await this.assertCanManageBusiness(currentUser, businessId);

    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
      select: {
        ownerUserId: true,
      },
    });

    let slug: string | undefined;

    if (dto.slug !== undefined) {
      slug = this.normalizeSlug(dto.slug);
      await this.ensureSlugAvailable(
        slug,
        business?.ownerUserId ?? currentUser.id,
        businessId,
      );
    }

    const settingData = dto.settings
      ? this.buildBusinessSettingData(dto.settings)
      : null;

    const brandingData = dto.branding
      ? this.buildBusinessBrandingData(dto.branding)
      : null;

    const data: Prisma.BusinessUpdateInput = {
      ...(dto.name !== undefined && {
        name: dto.name.trim(),
      }),

      ...(slug !== undefined && {
        slug,
      }),

      ...(dto.email !== undefined && {
        email: dto.email ? this.normalizeEmail(dto.email) : null,
      }),

      ...(dto.phone !== undefined && {
        phone: dto.phone?.trim() || null,
      }),

      ...(dto.country !== undefined && {
        country: dto.country?.trim() || null,
      }),

      ...(dto.currencyCode !== undefined && {
        currencyCode: dto.currencyCode.trim().toUpperCase(),
      }),

      ...(dto.timezone !== undefined && {
        timezone: dto.timezone.trim(),
      }),

      ...(dto.status !== undefined && {
        status: dto.status,
      }),

      updatedBy: {
        connect: {
          id: currentUser.id,
        },
      },

      ...(settingData &&
        this.hasKeys(settingData) && {
          settings: {
            upsert: {
              create: settingData,
              update: settingData,
            },
          },
        }),

      ...(brandingData &&
        this.hasKeys(brandingData) && {
          branding: {
            upsert: {
              create: brandingData,
              update: brandingData,
            },
          },
        }),
    };

    try {
      return await this.prisma.business.update({
        where: {
          id: businessId,
        },
        data,
        include: BUSINESS_INCLUDE,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(currentUser: CurrentUserPayload, businessId: number) {
    await this.assertCanManageBusiness(currentUser, businessId);

    await this.prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        status: BusinessStatus.INACTIVE,
        deletedAt: new Date(),
        updatedBy: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return {
      message: "Business deleted successfully",
    };
  }

  private getBusinessAccessWhere(
    currentUser: CurrentUserPayload,
  ): Prisma.BusinessWhereInput {
    if (currentUser.type === SystemUserType.ADMIN) {
      return {};
    }

    return {
      OR: [
        {
          ownerUserId: currentUser.id,
        },
        {
          members: {
            some: {
              userId: currentUser.id,
              status: BusinessMemberStatus.ACTIVE,
              deletedAt: null,
            },
          },
        },
      ],
    };
  }

  async assertCanAccessBusiness(
    currentUser: CurrentUserPayload,
    businessId: number,
  ) {
    const where: Prisma.BusinessWhereInput = {
      id: businessId,
      deletedAt: null,
      ...(currentUser.type !== SystemUserType.ADMIN && {
        status: {
          in: ACCESSIBLE_BUSINESS_STATUSES,
        },
        ...this.getBusinessAccessWhere(currentUser),
      }),
    };

    const business = await this.prisma.business.findFirst({
      where,
      select: {
        id: true,
      },
    });

    if (!business) {
      throw new ForbiddenException(
        "You do not have permission for this business",
      );
    }
  }

  async assertCanManageBusiness(
    currentUser: CurrentUserPayload,
    businessId: number,
  ) {
    return this.assertCanAccessBusiness(currentUser, businessId);
  }

  private async ensureSlugAvailable(
    slug: string,
    ownerUserId: number,
    ignoreBusinessId?: number,
  ) {
    const existingBusiness = await this.prisma.business.findFirst({
      where: {
        slug,
        ownerUserId,
        ...(ignoreBusinessId !== undefined && {
          id: {
            not: ignoreBusinessId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingBusiness) {
      throw new ConflictException("Business slug already exists");
    }
  }

  private buildBusinessSettingData(
    dto: NonNullable<CreateBusinessDto["settings"]>,
  ) {
    return {
      ...(dto.orderPrefix !== undefined && {
        orderPrefix: dto.orderPrefix.trim().toUpperCase(),
      }),

      ...(dto.invoicePrefix !== undefined && {
        invoicePrefix: dto.invoicePrefix.trim().toUpperCase(),
      }),

      ...(dto.defaultLanguage !== undefined && {
        defaultLanguage: dto.defaultLanguage.trim().toLowerCase(),
      }),

      ...(dto.defaultCurrency !== undefined && {
        defaultCurrency: dto.defaultCurrency.trim().toUpperCase(),
      }),

      ...(dto.timezone !== undefined && {
        timezone: dto.timezone.trim(),
      }),

      ...(dto.lowStockThreshold !== undefined && {
        lowStockThreshold: dto.lowStockThreshold,
      }),

      ...(dto.allowBackorder !== undefined && {
        allowBackorder: dto.allowBackorder,
      }),

      ...(dto.autoConfirmOrder !== undefined && {
        autoConfirmOrder: dto.autoConfirmOrder,
      }),

      ...(dto.codEnabled !== undefined && {
        codEnabled: dto.codEnabled,
      }),

      ...(dto.onlinePaymentEnabled !== undefined && {
        onlinePaymentEnabled: dto.onlinePaymentEnabled,
      }),
    };
  }

  private buildBusinessBrandingData(
    dto: NonNullable<CreateBusinessDto["branding"]>,
  ) {
    return {
      ...(dto.logoUrl !== undefined && {
        logoUrl: dto.logoUrl || null,
      }),

      ...(dto.faviconUrl !== undefined && {
        faviconUrl: dto.faviconUrl || null,
      }),

      ...(dto.primaryColor !== undefined && {
        primaryColor: dto.primaryColor || null,
      }),

      ...(dto.secondaryColor !== undefined && {
        secondaryColor: dto.secondaryColor || null,
      }),

      ...(dto.accentColor !== undefined && {
        accentColor: dto.accentColor || null,
      }),

      ...(dto.fontFamily !== undefined && {
        fontFamily: dto.fontFamily || null,
      }),

      ...(dto.seoTitle !== undefined && {
        seoTitle: dto.seoTitle || null,
      }),

      ...(dto.seoDescription !== undefined && {
        seoDescription: dto.seoDescription || null,
      }),
    };
  }

  private normalizeSlug(value: string) {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new BadRequestException("Invalid business slug");
    }

    if (slug.length > 180) {
      throw new BadRequestException(
        "Business slug must be less than 180 characters",
      );
    }

    return slug;
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private hasKeys(value: object) {
    return Object.keys(value).length > 0;
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
