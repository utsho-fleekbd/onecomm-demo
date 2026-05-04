import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  PlatformRole,
  StoreMemberStatus,
  StoreStatus,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { StoresService } from "../stores/stores.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly storeService: StoresService,
  ) {}

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        password: hashedPassword,
        role: PlatformRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const store = await this.storeService.create(user.id, {
      name: "New Store",
    });

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: store.id,
    });

    return {
      accessToken,
      requiresStoreSelection: false,
      activeStore: store,
      user,
    };
  }

  async login(dto: LoginDto) {
    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException("Your account has been suspended");
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException("Your account is inactive");
    }

    const stores = await this.getAccessibleStores(user.id);

    if (stores.length === 0) {
      throw new ForbiddenException("You are not assigned to any store");
    }

    /**
     * Case 1:
     * User has only one accessible store.
     * Log him directly into that store.
     */
    if (stores.length === 1) {
      const activeStore = stores[0];

      const accessToken = await this.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        storeId: activeStore.id,
        storeMemberId: activeStore.storeMemberId,
      });

      return {
        accessToken,
        requiresStoreSelection: false,
        activeStore,
        stores,
        user: this.sanitizeUser(user),
      };
    }

    /**
     * Case 2:
     * User has multiple stores.
     * Return identity token first.
     * Frontend should show store picker.
     */
    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      requiresStoreSelection: true,
      activeStore: null,
      stores,
      user: this.sanitizeUser(user),
    };
  }

  async selectStore(userId: string, storeId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid authenticated user");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException("User account is not active");
    }

    const stores = await this.getAccessibleStores(user.id);

    const selectedStore = stores.find((store) => store.id === storeId);

    if (!selectedStore) {
      throw new ForbiddenException("You do not have access to this store");
    }

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: selectedStore.id,
      storeMemberId: selectedStore.storeMemberId,
    });

    return {
      accessToken,
      activeStore: selectedStore,
      user,
    };
  }

  async me(userId: string, storeId: string | null) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const stores = await this.getAccessibleStores(userId);

    const activeStore = storeId
      ? (stores.find((store) => store.id === storeId) ?? null)
      : null;

    return {
      user,
      activeStore,
      stores,
    };
  }

  private async getAccessibleStores(userId: string) {
    const [ownedStores, memberships] = await Promise.all([
      this.prisma.store.findMany({
        where: {
          ownerId: userId,
          status: StoreStatus.ACTIVE,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      this.prisma.storeMember.findMany({
        where: {
          userId,
          status: StoreMemberStatus.ACTIVE,
          store: {
            status: StoreStatus.ACTIVE,
          },
        },
        select: {
          id: true,
          status: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              createdAt: true,
            },
          },
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  permissions: {
                    select: {
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
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const storeMap = new Map<string, any>();

    for (const store of ownedStores) {
      storeMap.set(store.id, {
        ...store,
        storeMemberId: null,
        isOwner: true,
        roles: [],
        permissions: [],
      });
    }

    for (const membership of memberships) {
      const permissions = membership.roles.flatMap((memberRole) =>
        memberRole.role.permissions.map((rolePermission) => ({
          id: rolePermission.permission.id,
          key: rolePermission.permission.key,
          action: rolePermission.permission.action,
          module: rolePermission.permission.module,
        })),
      );

      storeMap.set(membership.store.id, {
        ...membership.store,
        storeMemberId: membership.id,
        isOwner: storeMap.get(membership.store.id)?.isOwner ?? false,
        roles: membership.roles.map((memberRole) => memberRole.role),
        permissions,
      });
    }

    return Array.from(storeMap.values());
  }

  private async generateAccessToken(user: {
    id: string;
    email: string;
    role: PlatformRole;
    storeId?: string;
    storeMemberId?: string | null;
  }) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
      storeMemberId: user.storeMemberId,
    });
  }

  private sanitizeUser(user: {
    id: string;
    name: string;
    email: string;
    role: PlatformRole;
    status: UserStatus;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
