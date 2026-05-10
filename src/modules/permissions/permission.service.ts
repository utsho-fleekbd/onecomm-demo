import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CommonStatus,
  PermissionAction,
  Prisma,
  RbacFeature,
  UserRoleMapStatus,
} from "@prisma/client";

import { AddPermissionDto } from "./dto/add-permission";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionItemDto } from "./dto/permission-item.dto";
import { QueryPermissionDto } from "./dto/query-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

const ROLE_PERMISSION_INCLUDE = {
  role: {
    select: {
      id: true,
      businessId: true,
      name: true,
      status: true,
    },
  },
} satisfies Prisma.RbacRolePermissionInclude;

const ROLE_WITH_PERMISSIONS_INCLUDE = {
  permissions: {
    orderBy: [{ feature: "asc" }, { action: "asc" }],
  },
  _count: {
    select: {
      userRoleMaps: true,
    },
  },
} satisfies Prisma.RbacRoleInclude;

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  getAvailablePermissions() {
    return {
      actions: Object.values(PermissionAction),
      features: Object.values(RbacFeature).map((feature) => ({
        feature,
        actions: Object.values(PermissionAction),
      })),
    };
  }

  async findAll(businessId: number, query: QueryPermissionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.RbacRolePermissionWhereInput = {
      role: {
        businessId,
        deletedAt: null,
      },

      ...(query.roleId !== undefined && {
        roleId: query.roleId,
      }),

      ...(query.feature !== undefined && {
        feature: query.feature,
      }),

      ...(query.action !== undefined && {
        action: query.action,
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.rbacRolePermission.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ roleId: "asc" }, { feature: "asc" }, { action: "asc" }],
        include: ROLE_PERMISSION_INCLUDE,
      }),

      this.prisma.rbacRolePermission.count({
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

  async findByRole(businessId: number, roleId: number) {
    return this.getRoleWithPermissionsOrThrow(businessId, roleId);
  }

  async addToRole(businessId: number, roleId: number, dto: AddPermissionDto) {
    await this.assertRoleBelongsToBusiness(businessId, roleId);

    const permissions = this.normalizePermissions(dto.permissions);

    return this.prisma.$transaction(async (tx) => {
      await tx.rbacRolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId,
          feature: permission.feature,
          action: permission.action,
        })),
        skipDuplicates: true,
      });

      return tx.rbacRole.findFirst({
        where: {
          id: roleId,
          businessId,
          deletedAt: null,
        },
        include: ROLE_WITH_PERMISSIONS_INCLUDE,
      });
    });
  }

  async replaceRolePermissions(
    businessId: number,
    roleId: number,
    dto: UpdatePermissionDto,
  ) {
    await this.assertRoleBelongsToBusiness(businessId, roleId);

    const permissions = this.normalizePermissions(dto.permissions);

    return this.prisma.$transaction(async (tx) => {
      await tx.rbacRolePermission.deleteMany({
        where: {
          roleId,
        },
      });

      if (permissions.length > 0) {
        await tx.rbacRolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId,
            feature: permission.feature,
            action: permission.action,
          })),
        });
      }

      return tx.rbacRole.findFirst({
        where: {
          id: roleId,
          businessId,
          deletedAt: null,
        },
        include: ROLE_WITH_PERMISSIONS_INCLUDE,
      });
    });
  }

  async removeFromRole(
    businessId: number,
    roleId: number,
    feature: RbacFeature,
    action: PermissionAction,
  ) {
    await this.assertRoleBelongsToBusiness(businessId, roleId);

    const result = await this.prisma.rbacRolePermission.deleteMany({
      where: {
        roleId,
        feature,
        action,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException("Permission not found for this role");
    }

    return this.getRoleWithPermissionsOrThrow(businessId, roleId);
  }

  async hasPermission(
    currentUser: CurrentUserPayload,
    businessId: number,
    feature: RbacFeature,
    action: PermissionAction,
  ) {
    const isOwner = await this.isBusinessOwner(currentUser.id, businessId);

    if (isOwner) {
      return true;
    }

    const now = new Date();

    const roleMap = await this.prisma.rbacUserRoleMap.findFirst({
      where: {
        userId: currentUser.id,
        status: UserRoleMapStatus.ACTIVE,

        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: now,
            },
          },
        ],

        role: {
          businessId,
          status: CommonStatus.ACTIVE,
          deletedAt: null,
          permissions: {
            some: {
              feature,
              action,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(roleMap);
  }

  async assertPermission(
    currentUser: CurrentUserPayload,
    businessId: number,
    feature: RbacFeature,
    action: PermissionAction,
  ) {
    const hasPermission = await this.hasPermission(
      currentUser,
      businessId,
      feature,
      action,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission to ${action.toLowerCase()} ${feature.toLowerCase()}`,
      );
    }
  }

  private async getRoleWithPermissionsOrThrow(
    businessId: number,
    roleId: number,
  ) {
    const role = await this.prisma.rbacRole.findFirst({
      where: {
        id: roleId,
        businessId,
        deletedAt: null,
      },
      include: ROLE_WITH_PERMISSIONS_INCLUDE,
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return role;
  }

  private async assertRoleBelongsToBusiness(
    businessId: number,
    roleId: number,
  ) {
    const role = await this.prisma.rbacRole.findFirst({
      where: {
        id: roleId,
        businessId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }
  }

  private async isBusinessOwner(userId: number, businessId: number) {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        deletedAt: null,
        ownerUserId: userId,
      },
      select: {
        id: true,
      },
    });

    return Boolean(business);
  }

  private normalizePermissions(permissions: PermissionItemDto[]) {
    const uniquePermissions = new Map<string, PermissionItemDto>();

    for (const permission of permissions) {
      const key = `${permission.feature}:${permission.action}`;

      if (uniquePermissions.has(key)) {
        throw new BadRequestException(
          `Duplicate permission: ${permission.feature}:${permission.action}`,
        );
      }

      uniquePermissions.set(key, permission);
    }

    return Array.from(uniquePermissions.values());
  }
}
