import { PackageStatus, Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { paginatedResponse } from "../../common/utils/api-response.util";
import { QueryPackageDto } from "./dto/query-package.dto";

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getPackages(query: QueryPackageDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PackagePlanWhereInput = {
      deletedAt: null,
      status: PackageStatus.ACTIVE,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const items = await this.prisma.packagePlan.findMany({
      where,
      skip,
      take: limit,
      include: {
        limits: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    const total = await this.prisma.packagePlan.count({ where });

    return paginatedResponse(items, {
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }
}
