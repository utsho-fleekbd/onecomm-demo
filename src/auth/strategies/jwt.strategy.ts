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
    const secret = configService.get<string>("JWT_ACCESS_SECRET");

    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET is missing");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
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

    /**
     * This is allowed.
     *
     * It means the user is authenticated,
     * but has not selected an active store yet.
     *
     * Useful for:
     * POST /auth/select-store
     * GET  /auth/me
     */
    if (!payload.storeId) {
      return {
        ...user,
        storeId: null,
        storeMemberId: null,
        isStoreOwner: false,
        permissions: [],
      };
    }

    const store = await this.prisma.store.findFirst({
      where: {
        id: payload.storeId,
        status: StoreStatus.ACTIVE,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!store) {
      throw new UnauthorizedException("Invalid store context");
    }

    /**
     * Store owner always has access to own store.
     */
    if (store.ownerId === user.id) {
      return {
        ...user,
        storeId: store.id,
        storeMemberId: null,
        isStoreOwner: true,
        permissions: ["*"],
      };
    }

    /**
     * Normal store user/employee must have active StoreMember.
     */
    const storeMember = await this.prisma.storeMember.findFirst({
      where: {
        storeId: store.id,
        userId: user.id,
        status: StoreMemberStatus.ACTIVE,
      },
      select: {
        id: true,
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
    });

    if (!storeMember) {
      throw new UnauthorizedException("You do not have access to this store");
    }

    const permissions = storeMember.roles.flatMap((memberRole) =>
      memberRole.role.permissions.map(
        (rolePermission) => rolePermission.permission.key,
      ),
    );

    return {
      ...user,
      storeId: store.id,
      storeMemberId: storeMember.id,
      isStoreOwner: false,
      permissions,
    };
  }
}
