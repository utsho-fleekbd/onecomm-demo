import { Request } from "express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { SystemUserStatus, SystemUserType } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUserPayload } from "../decorators/current-user.decorator";

export type JwtPayload = {
  sub: number;
  businessId: number | null;
  type: SystemUserType;
};

export type AuthenticatedRequest = Request & {
  user: CurrentUserPayload;
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
        OR: [
          {
            ownerUserId: user.id,
          },
          {
            members: {
              some: {
                userId: user.id,
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
