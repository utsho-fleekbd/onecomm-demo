import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  BusinessMemberStatus,
  BusinessStatus,
  SystemUserStatus,
  SystemUserType,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import { CurrentUserPayload } from "../decorators/current-user.decorator";

const ACCESSIBLE_BUSINESS_STATUSES = [
  BusinessStatus.TRIAL,
  BusinessStatus.ACTIVE,
] satisfies BusinessStatus[];

export type JwtPayload = {
  sub: number;
  businessId: number | null;
  type: SystemUserType;
};

export type AuthenticatedRequest = Request & {
  user: CurrentUserPayload;
  businessId?: number | null;
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

  async validate(payload: JwtPayload): Promise<CurrentUserPayload> {
    const user = await this.prisma.systemUser.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    if (user.status !== SystemUserStatus.ACTIVE) {
      throw new UnauthorizedException("Account is not active");
    }

    if (payload.type !== user.type) {
      throw new UnauthorizedException("Invalid token");
    }

    if (user.type === SystemUserType.ADMIN) {
      return {
        ...user,
        businessId: null,
      };
    }

    if (!payload.businessId) {
      throw new UnauthorizedException("No business selected");
    }

    const business = await this.prisma.business.findFirst({
      where: {
        id: payload.businessId,
        deletedAt: null,
        status: {
          in: ACCESSIBLE_BUSINESS_STATUSES,
        },
        OR: [
          {
            ownerUserId: user.id,
          },
          {
            members: {
              some: {
                userId: user.id,
                status: BusinessMemberStatus.ACTIVE,
                deletedAt: null,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!business) {
      throw new UnauthorizedException("You do not have access to this store");
    }

    return {
      ...user,
      businessId: payload.businessId,
    };
  }
}
