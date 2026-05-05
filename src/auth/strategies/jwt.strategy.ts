import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
  PlatformRole,
  StoreMemberStatus,
  StoreStatus,
  UserStatus,
} from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

export type JwtPayload = {
  sub: string;
  email: string;
  role: PlatformRole;
  storeId?: string;
  storeMemberId?: string | null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub;
    const storeId = payload.storeId;

    /**
     * Case 1:
     * User is authenticated, but no store is selected yet.
     *
     * Example:
     * POST /auth/select-store
     * GET  /auth/me
     */
    if (!storeId) {
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
        throw new UnauthorizedException("Invalid token");
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("Account is not active");
      }

      return {
        ...user,
        storeId: null,
        storeMemberId: null,
        isStoreOwner: false,
        permissions: [],
      };
    }

    /**
     * Case 2:
     * Store context exists.
     *
     * This single query checks:
     * - user exists
     * - user is active
     * - user owns this active store, OR
     * - user is an active member of this active store
     */
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

        ownedStores: {
          where: {
            id: storeId,
            status: StoreStatus.ACTIVE,
          },
          select: {
            id: true,
          },
          take: 1,
        },

        memberships: {
          where: {
            storeId,
            status: StoreMemberStatus.ACTIVE,
            store: {
              status: StoreStatus.ACTIVE,
            },
          },
          select: {
            id: true,
            storeId: true,
            roles: {
              select: {
                role: {
                  select: {
                    permissions: {
                      select: {
                        permission: {
                          select: {
                            key: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Account is not active");
    }

    const ownedStore = user.ownedStores[0];

    /**
     * Store owner always has full access.
     */
    if (ownedStore) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        storeId: ownedStore.id,
        storeMemberId: null,
        isStoreOwner: true,
        permissions: ["*"],
      };
    }

    const storeMember = user.memberships[0];

    if (!storeMember) {
      throw new UnauthorizedException("You do not have access to this store");
    }

    const permissions = [
      ...new Set(
        storeMember.roles.flatMap((memberRole) =>
          memberRole.role.permissions.map(
            (rolePermission) => rolePermission.permission.key,
          ),
        ),
      ),
    ];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      storeId: storeMember.storeId,
      storeMemberId: storeMember.id,
      isStoreOwner: false,
      permissions,
    };
  }
}
