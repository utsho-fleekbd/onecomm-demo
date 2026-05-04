import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StoresService } from "../stores/stores.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleQueryDto } from "./dto/role-query.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

const ROLE_INCLUDE = {
  permissions: {
    include: {
      permission: {
        select: {
          id: true,
          key: true,
          action: true,
          module: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  _count: {
    select: {
      members: true,
      permissions: true,
    },
  },
} satisfies Prisma.RoleInclude;

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
  ) {}

  async create(userId: string, storeId: string, dto: CreateRoleDto) {
    await this.storesService.assertStoreOwner(userId, storeId);

    const name = this.normalizeName(dto.name);
    const permissionIds = dto.permissionIds ?? [];

    await this.ensureRoleNameAvailable(storeId, name);
    await this.ensurePermissionsExist(permissionIds);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            storeId,
            name,
            description: dto.description?.trim(),
          },
          select: {
            id: true,
          },
        });

        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
              roleId: role.id,
              permissionId,
            })),
            skipDuplicates: true,
          });
        }

        return tx.role.findUnique({
          where: {
            id: role.id,
          },
          include: ROLE_INCLUDE,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(userId: string, storeId: string, query: RoleQueryDto) {
    await this.storesService.assertStoreOwner(userId, storeId);

    const where: Prisma.RoleWhereInput = {
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
            description: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.role.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: ROLE_INCLUDE,
    });
  }

  async findOne(userId: string, storeId: string, roleId: string) {
    await this.storesService.assertStoreOwner(userId, storeId);

    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        storeId,
      },
      include: ROLE_INCLUDE,
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return role;
  }

  async update(
    userId: string,
    storeId: string,
    roleId: string,
    dto: UpdateRoleDto,
  ) {
    await this.storesService.assertStoreOwner(userId, storeId);

    const role = await this.ensureRoleBelongsToStore(storeId, roleId);

    if (role.isSystem) {
      throw new BadRequestException("System role cannot be updated");
    }

    let name: string | undefined;

    if (dto.name !== undefined) {
      name = this.normalizeName(dto.name);
      await this.ensureRoleNameAvailable(storeId, name, roleId);
    }

    if (dto.permissionIds !== undefined) {
      await this.ensurePermissionsExist(dto.permissionIds);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.role.update({
          where: {
            id: roleId,
          },
          data: {
            ...(name !== undefined && { name }),
            ...(dto.description !== undefined && {
              description: dto.description?.trim(),
            }),
          },
        });

        if (dto.permissionIds !== undefined) {
          await tx.rolePermission.deleteMany({
            where: {
              roleId,
            },
          });

          if (dto.permissionIds.length > 0) {
            await tx.rolePermission.createMany({
              data: dto.permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
              })),
              skipDuplicates: true,
            });
          }
        }

        return tx.role.findUnique({
          where: {
            id: roleId,
          },
          include: ROLE_INCLUDE,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(userId: string, storeId: string, roleId: string) {
    await this.storesService.assertStoreOwner(userId, storeId);

    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        storeId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    if (role.isSystem) {
      throw new BadRequestException("System role cannot be deleted");
    }

    if (role._count.members > 0) {
      throw new BadRequestException("Cannot delete role assigned to users");
    }

    await this.prisma.role.delete({
      where: {
        id: roleId,
      },
    });

    return {
      message: "Role deleted successfully",
    };
  }

  private async ensureRoleBelongsToStore(storeId: string, roleId: string) {
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        storeId,
      },
      select: {
        id: true,
        isSystem: true,
      },
    });

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return role;
  }

  private async ensureRoleNameAvailable(
    storeId: string,
    name: string,
    ignoreRoleId?: string,
  ) {
    const existingRole = await this.prisma.role.findFirst({
      where: {
        storeId,
        name,
        ...(ignoreRoleId && {
          NOT: {
            id: ignoreRoleId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    if (existingRole) {
      throw new ConflictException("Role name already exists");
    }
  }

  private async ensurePermissionsExist(permissionIds: string[]) {
    if (permissionIds.length === 0) {
      return;
    }

    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException("One or more permissions do not exist");
    }
  }

  private normalizeName(value: string) {
    const name = value.trim();

    if (!name) {
      throw new BadRequestException("Role name is required");
    }

    return name;
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Role name already exists");
    }

    throw error;
  }
}
