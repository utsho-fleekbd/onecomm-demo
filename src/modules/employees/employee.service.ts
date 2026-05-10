import * as argon2 from "argon2";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CommonStatus,
  PermissionAction,
  Prisma,
  RbacFeature,
  SystemUserStatus,
  SystemUserType,
  UserRoleMapStatus,
} from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { EmployeeProfileDto } from "./dto/employee-profile.dto";
import { QueryEmployeesDto } from "./dto/query-employees.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { AssignEmployeeRolesDto } from "./dto/assign-employee-roles.dto";
import { UpdateEmployeeStatusDto } from "./dto/update-employee-status.dto";

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: CurrentUserPayload,
    businessId: number,
    dto: CreateEmployeeDto,
  ) {
    await this.assertBusinessExists(businessId);

    const email = this.normalizeEmail(dto.email);
    const phone = this.normalizeNullableText(dto.phone);

    await this.assertEmailAvailable(email);

    if (phone) {
      await this.assertPhoneAvailable(phone);
    }

    const roleIds = this.normalizeRoleIds(dto.roleIds ?? []);

    if (roleIds.length > 0) {
      await this.assertRolesBelongToBusiness(businessId, roleIds);
    }

    const passwordHash = await this.hashPassword(dto.password);
    const profileData = this.buildProfileData(dto.profile);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const employee = await tx.systemUser.create({
          data: {
            name: dto.name.trim(),
            email,
            phone,
            passwordHash,
            type: SystemUserType.EMPLOYEE,
            status: dto.status ?? SystemUserStatus.ACTIVE,

            createdById: currentUser.id,
            updatedById: currentUser.id,

            ...(profileData && {
              profile: {
                create: profileData,
              },
            }),

            businessMembers: {
              create: {
                businessId,
              },
            },
          },
          select: this.getEmployeeSelect(businessId),
        });

        if (roleIds.length > 0) {
          await tx.rbacUserRoleMap.createMany({
            data: roleIds.map((roleId) => ({
              userId: employee.id,
              roleId,
              status: UserRoleMapStatus.ACTIVE,
              assignedBy: currentUser.id,
            })),
            skipDuplicates: true,
          });
        }

        return this.getEmployeeByIdOrThrow(tx, businessId, employee.id);
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(businessId: number, query: QueryEmployeesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const where: Prisma.SystemUserWhereInput = {
      type: SystemUserType.EMPLOYEE,

      businessMembers: {
        some: {
          businessId,
          deletedAt: null,
        },
      },

      ...(!query.includeDeleted && {
        deletedAt: null,
      }),

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
        ],
      }),
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
        select: this.getEmployeeSelect(businessId),
      }),

      this.prisma.systemUser.count({
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

  async findOne(businessId: number, employeeId: number) {
    return this.getEmployeeByIdOrThrow(this.prisma, businessId, employeeId);
  }

  async update(
    currentUser: CurrentUserPayload,
    businessId: number,
    employeeId: number,
    dto: UpdateEmployeeDto,
  ) {
    await this.assertEmployeeBelongsToBusiness(businessId, employeeId);

    const email =
      dto.email !== undefined ? this.normalizeEmail(dto.email) : undefined;

    const phone =
      dto.phone !== undefined
        ? this.normalizeNullableText(dto.phone)
        : undefined;

    if (email !== undefined) {
      await this.assertEmailAvailable(email, employeeId);
    }

    if (phone) {
      await this.assertPhoneAvailable(phone, employeeId);
    }

    const passwordHash = dto.password
      ? await this.hashPassword(dto.password)
      : undefined;

    const profileData = this.buildProfileData(dto.profile);

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.systemUser.update({
          where: {
            id: employeeId,
          },
          data: {
            ...(dto.name !== undefined && {
              name: dto.name.trim(),
            }),

            ...(email !== undefined && {
              email,
            }),

            ...(phone !== undefined && {
              phone,
            }),

            ...(passwordHash !== undefined && {
              passwordHash,
            }),

            updatedById: currentUser.id,

            ...(profileData && {
              profile: {
                upsert: {
                  create: profileData,
                  update: profileData,
                },
              },
            }),
          },
        });

        return this.getEmployeeByIdOrThrow(tx, businessId, employeeId);
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateStatus(
    currentUser: CurrentUserPayload,
    businessId: number,
    employeeId: number,
    dto: UpdateEmployeeStatusDto,
  ) {
    await this.assertEmployeeBelongsToBusiness(businessId, employeeId);

    await this.prisma.systemUser.update({
      where: {
        id: employeeId,
      },
      data: {
        status: dto.status,
        updatedById: currentUser.id,
      },
    });

    return this.getEmployeeByIdOrThrow(this.prisma, businessId, employeeId);
  }

  async replaceRoles(
    currentUser: CurrentUserPayload,
    businessId: number,
    employeeId: number,
    dto: AssignEmployeeRolesDto,
  ) {
    await this.assertEmployeeBelongsToBusiness(businessId, employeeId);

    const roleIds = this.normalizeRoleIds(dto.roleIds);

    if (roleIds.length > 0) {
      await this.assertRolesBelongToBusiness(businessId, roleIds);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rbacUserRoleMap.updateMany({
        where: {
          userId: employeeId,
          role: {
            businessId,
          },
          status: UserRoleMapStatus.ACTIVE,
        },
        data: {
          status: UserRoleMapStatus.REVOKED,
        },
      });

      if (roleIds.length > 0) {
        await tx.rbacUserRoleMap.createMany({
          data: roleIds.map((roleId) => ({
            userId: employeeId,
            roleId,
            status: UserRoleMapStatus.ACTIVE,
            assignedBy: currentUser.id,
          })),
          skipDuplicates: true,
        });

        await tx.rbacUserRoleMap.updateMany({
          where: {
            userId: employeeId,
            roleId: {
              in: roleIds,
            },
            status: {
              not: UserRoleMapStatus.ACTIVE,
            },
          },
          data: {
            status: UserRoleMapStatus.ACTIVE,
            assignedBy: currentUser.id,
            assignedAt: new Date(),
            expiresAt: null,
          },
        });
      }
    });

    return this.getEmployeeByIdOrThrow(this.prisma, businessId, employeeId);
  }

  async remove(
    currentUser: CurrentUserPayload,
    businessId: number,
    employeeId: number,
  ) {
    if (currentUser.id === employeeId) {
      throw new BadRequestException("You cannot delete your own account here");
    }

    await this.assertEmployeeBelongsToBusiness(businessId, employeeId);

    await this.prisma.$transaction(async (tx) => {
      await tx.businessMember.updateMany({
        where: {
          businessId,
          userId: employeeId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.rbacUserRoleMap.updateMany({
        where: {
          userId: employeeId,
          role: {
            businessId,
          },
          status: UserRoleMapStatus.ACTIVE,
        },
        data: {
          status: UserRoleMapStatus.REVOKED,
        },
      });

      await tx.systemUserProfile.updateMany({
        where: {
          userId: employeeId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.systemUser.update({
        where: {
          id: employeeId,
        },
        data: {
          status: SystemUserStatus.INACTIVE,
          deletedAt: new Date(),
          deletedById: currentUser.id,
          updatedById: currentUser.id,
        },
      });
    });

    return {
      message: "Employee deleted successfully",
    };
  }

  private getEmployeeSelect(businessId: number): Prisma.SystemUserSelect {
    return {
      id: true,
      uuid: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      status: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,

      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          city: true,
          country: true,
          bio: true,
        },
      },

      businessMembers: {
        where: {
          businessId,
        },
        select: {
          id: true,
          businessId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },

      userRoleMaps: {
        where: {
          role: {
            businessId,
            deletedAt: null,
          },
        },
        select: {
          id: true,
          status: true,
          assignedAt: true,
          expiresAt: true,
          role: {
            select: {
              id: true,
              businessId: true,
              name: true,
              description: true,
              status: true,
              permissions: {
                orderBy: [{ feature: "asc" }, { action: "asc" }],
                select: {
                  id: true,
                  feature: true,
                  action: true,
                },
              },
            },
          },
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
        },
      },

      updatedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
        },
      },
    };
  }

  private async getEmployeeByIdOrThrow(
    prisma: Prisma.TransactionClient | PrismaService,
    businessId: number,
    employeeId: number,
  ) {
    const employee = await prisma.systemUser.findFirst({
      where: {
        id: employeeId,
        type: SystemUserType.EMPLOYEE,
        deletedAt: null,
        businessMembers: {
          some: {
            businessId,
            deletedAt: null,
          },
        },
      },
      select: this.getEmployeeSelect(businessId),
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    return employee;
  }

  private async assertBusinessExists(businessId: number) {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!business) {
      throw new NotFoundException("Business not found");
    }
  }

  private async assertEmployeeBelongsToBusiness(
    businessId: number,
    employeeId: number,
  ) {
    const employee = await this.prisma.systemUser.findFirst({
      where: {
        id: employeeId,
        type: SystemUserType.EMPLOYEE,
        deletedAt: null,
        businessMembers: {
          some: {
            businessId,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!employee) {
      throw new NotFoundException("Employee not found in this business");
    }
  }

  private async assertRolesBelongToBusiness(
    businessId: number,
    roleIds: number[],
  ) {
    const roles = await this.prisma.rbacRole.findMany({
      where: {
        id: {
          in: roleIds,
        },
        businessId,
        status: CommonStatus.ACTIVE,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException(
        "One or more selected roles are invalid for this business",
      );
    }
  }

  private async assertEmailAvailable(email: string, ignoreUserId?: number) {
    const existingUser = await this.prisma.systemUser.findFirst({
      where: {
        email,

        ...(ignoreUserId && {
          id: {
            not: ignoreUserId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }
  }

  private async assertPhoneAvailable(phone: string, ignoreUserId?: number) {
    const existingUser = await this.prisma.systemUser.findFirst({
      where: {
        phone,

        ...(ignoreUserId && {
          id: {
            not: ignoreUserId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("Phone already exists");
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizeNullableText(value?: string | null) {
    if (value === undefined) {
      return undefined;
    }

    const normalizedValue = value?.trim();

    return normalizedValue || null;
  }

  private normalizeNullableDate(value?: string | null) {
    if (value === undefined) {
      return undefined;
    }

    if (!value) {
      return null;
    }

    return new Date(value);
  }

  private normalizeRoleIds(roleIds: number[]) {
    const uniqueRoleIds = [...new Set(roleIds)];

    for (const roleId of uniqueRoleIds) {
      if (!Number.isInteger(roleId) || roleId <= 0) {
        throw new BadRequestException("Invalid role ID");
      }
    }

    return uniqueRoleIds;
  }

  private buildProfileData(profile?: EmployeeProfileDto) {
    if (!profile) {
      return undefined;
    }

    return {
      firstName: this.normalizeNullableText(profile.firstName),
      lastName: this.normalizeNullableText(profile.lastName),
      imageUrl: this.normalizeNullableText(profile.imageUrl),
      dateOfBirth: this.normalizeNullableDate(profile.dateOfBirth),
      gender: profile.gender ?? undefined,
      address: this.normalizeNullableText(profile.address),
      city: this.normalizeNullableText(profile.city),
      country: this.normalizeNullableText(profile.country),
      bio: this.normalizeNullableText(profile.bio),
    };
  }

  private async hashPassword(password: string) {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictException("Employee email or phone already exists");
      }

      if (error.code === "P2025") {
        throw new NotFoundException("Employee not found");
      }
    }

    throw error;
  }
}
