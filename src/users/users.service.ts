import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PlatformRole, Prisma, StoreMemberStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { StoresService } from "../stores/stores.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";

const STORE_USER_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  roles: {
    include: {
      role: {
        select: {
          id: true,
          name: true,
          description: true,
          isSystem: true,
        },
      },
    },
  },
} satisfies Prisma.StoreMemberInclude;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
  ) {}

  async create(currentUserId: string, storeId: string, dto: CreateUserDto) {
    await this.storesService.assertStoreOwner(currentUserId, storeId);

    const email = this.normalizeEmail(dto.email);
    const roleIds = dto.roleIds ?? [];

    await this.ensureRolesBelongToStore(storeId, roleIds);

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("User email already exists");
    }

    const password = await this.hashPassword(dto.password);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            name: dto.name.trim(),
            email,
            password,
            role: PlatformRole.USER,
          },
          select: {
            id: true,
          },
        });

        const storeMember = await tx.storeMember.create({
          data: {
            storeId,
            userId: createdUser.id,
            status: dto.status ?? StoreMemberStatus.ACTIVE,
          },
          select: {
            id: true,
          },
        });

        if (roleIds.length > 0) {
          await tx.storeMemberRole.createMany({
            data: roleIds.map((roleId) => ({
              storeMemberId: storeMember.id,
              roleId,
              storeId,
            })),
          });
        }

        return tx.storeMember.findUnique({
          where: {
            id: storeMember.id,
          },
          include: STORE_USER_INCLUDE,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(currentUserId: string, storeId: string, query: UserQueryDto) {
    await this.storesService.assertStoreOwner(currentUserId, storeId);

    const where: Prisma.StoreMemberWhereInput = {
      storeId,
      ...(query.status && {
        status: query.status,
      }),
      ...(query.search && {
        user: {
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
          ],
        },
      }),
    };

    return this.prisma.storeMember.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: STORE_USER_INCLUDE,
    });
  }
  async findOne(currentUserId: string, storeId: string, userId: string) {
    await this.storesService.assertStoreOwner(currentUserId, storeId);

    const storeMember = await this.prisma.storeMember.findFirst({
      where: {
        storeId,
        userId,
      },
      include: STORE_USER_INCLUDE,
    });

    if (!storeMember) {
      throw new NotFoundException("Store user not found");
    }

    return storeMember;
  }

  async update(
    currentUserId: string,
    storeId: string,
    userId: string,
    dto: UpdateUserDto,
  ) {
    await this.storesService.assertStoreOwner(currentUserId, storeId);

    const storeMember = await this.ensureStoreMemberExists(storeId, userId);

    const roleIds = dto.roleIds;

    if (roleIds !== undefined) {
      await this.ensureRolesBelongToStore(storeId, roleIds);
    }

    const password =
      dto.password !== undefined
        ? await this.hashPassword(dto.password)
        : undefined;

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: userId,
          },
          data: {
            ...(dto.name !== undefined && {
              name: dto.name.trim(),
            }),
            ...(dto.email !== undefined && {
              email: this.normalizeEmail(dto.email),
            }),
            ...(password !== undefined && {
              password,
            }),
          },
        });

        await tx.storeMember.update({
          where: {
            id: storeMember.id,
          },
          data: {
            ...(dto.status !== undefined && {
              status: dto.status,
            }),
          },
        });

        if (roleIds !== undefined) {
          await tx.storeMemberRole.deleteMany({
            where: {
              storeMemberId: storeMember.id,
              storeId,
            },
          });

          if (roleIds.length > 0) {
            await tx.storeMemberRole.createMany({
              data: roleIds.map((roleId) => ({
                storeMemberId: storeMember.id,
                roleId,
                storeId,
              })),
            });
          }
        }

        return tx.storeMember.findUnique({
          where: {
            id: storeMember.id,
          },
          include: STORE_USER_INCLUDE,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(currentUserId: string, storeId: string, userId: string) {
    await this.storesService.assertStoreOwner(currentUserId, storeId);

    if (currentUserId === userId) {
      throw new BadRequestException(
        "You cannot remove yourself from the store",
      );
    }

    const storeMember = await this.ensureStoreMemberExists(storeId, userId);

    await this.prisma.$transaction(async (tx) => {
      await tx.storeMember.delete({
        where: {
          id: storeMember.id,
        },
      });

      const remainingUserLinks = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          _count: {
            select: {
              ownedStores: true,
              memberships: true,
            },
          },
        },
      });

      if (
        remainingUserLinks &&
        remainingUserLinks._count.ownedStores === 0 &&
        remainingUserLinks._count.memberships === 0
      ) {
        await tx.user.delete({
          where: {
            id: userId,
          },
        });
      }
    });

    return {
      message: "Store user removed successfully",
    };
  }

  private async ensureStoreMemberExists(storeId: string, userId: string) {
    const storeMember = await this.prisma.storeMember.findFirst({
      where: {
        storeId,
        userId,
      },
      select: {
        id: true,
        storeId: true,
        userId: true,
      },
    });

    if (!storeMember) {
      throw new NotFoundException("Store user not found");
    }

    return storeMember;
  }

  private async ensureRolesBelongToStore(storeId: string, roleIds: string[]) {
    if (roleIds.length === 0) {
      return;
    }

    const roles = await this.prisma.role.findMany({
      where: {
        storeId,
        id: {
          in: roleIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException("One or more roles do not belong to store");
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("User email already exists");
    }

    throw error;
  }
}
