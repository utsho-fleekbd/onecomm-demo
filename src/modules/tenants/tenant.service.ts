import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, SystemUserType } from "@prisma/client";
import { QueryTenantDto } from "./dto/query-tenant.dto";
import { UpdateTenantStatusDto } from "./dto/update-tenant-status.dto";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import {
  apiResponse,
  paginatedResponse,
} from "../../common/utils/api-response.util";

const TENANT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  type: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      ownedBusinesses: true,
      businessMembers: true,
    },
  },
} satisfies Prisma.SystemUserSelect;

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTenantDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const searchWhere: Prisma.SystemUserWhereInput | undefined = query.search
      ? {
          OR: [
            {
              name: {
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
              ownedBusinesses: {
                some: {
                  name: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : undefined;

    const statusWhere: Prisma.SystemUserWhereInput | undefined = query.status
      ? {
          status: query.status,
        }
      : undefined;

    const where: Prisma.SystemUserWhereInput = {
      AND: [
        { type: SystemUserType.TENANT },
        {
          deletedAt: null,
        },
        ...(statusWhere ? [statusWhere] : []),
        ...(searchWhere ? [searchWhere] : []),
      ],
    };

    const orderBy: Prisma.SystemUserOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.systemUser.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: TENANT_SELECT,
      }),

      this.prisma.systemUser.count({
        where,
      }),
    ]);

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async updateStatus(
    currentUser: CurrentUserPayload,
    tenantId: string,
    dto: UpdateTenantStatusDto,
  ) {
    const tenant = await this.prisma.systemUser.findFirst({
      where: {
        id: tenantId,
        type: SystemUserType.TENANT,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const updatedTenant = await this.prisma.systemUser.update({
      where: {
        id: tenantId,
      },
      data: {
        status: dto.status,
        updatedById: currentUser.id,
      },
      select: TENANT_SELECT,
    });

    return apiResponse(updatedTenant, "Tenant status updated successfully");
  }
}
