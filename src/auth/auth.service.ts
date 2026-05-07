import * as bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SystemUser, SystemUserStatus, SystemUserType } from "@prisma/client";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { PrismaService } from "../prisma/prisma.service";
import { BusinessService } from "../business/business.service";
import { JwtPayload } from "./strategies/jwt.strategy";

type SafeSystemUser = Omit<SystemUser, "passwordHash">;

type AuthBusiness = {
  id: number;
  ownerUserId: number;
  members: {
    id: number;
    userId: number;
  }[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly businessService: BusinessService,
  ) {}

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);

    const existingUser = await this.prisma.systemUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prisma.systemUser.create({
      data: {
        name: dto.name,
        email,
        passwordHash,
        type: SystemUserType.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    const business = await this.businessService.create(user.id, {
      name: "Matrix",
    });

    return {
      selectedBusiness: business,
      user,
    };
  }

  async login(dto: LoginDto) {
    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    this.assertActiveUser(user);

    const safeUser = this.toSafeUser(user);

    if (user.type === SystemUserType.ADMIN) {
      const tokens = await this.issueTokenPair({
        sub: user.id,
        type: user.type,
        businessId: null,
      });

      return {
        ...tokens,
        selectedBusiness: null,
        user: safeUser,
      };
    }

    const businesses = await this.prisma.business.findMany({
      where: {
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
        ownerUserId: true,
        members: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (businesses.length === 0) {
      throw new ForbiddenException("You are not assigned to any business");
    }

    const selectedBusiness = businesses[0];

    const tokens = await this.issueTokenPair({
      sub: user.id,
      type: user.type,
      businessId: selectedBusiness.id,
    });

    if (user.type === SystemUserType.TENANT) {
      return {
        ...tokens,
        selectedBusiness,
        businesses,
        user: safeUser,
      };
    }

    return {
      ...tokens,
      selectedBusiness,
      user: safeUser,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const refreshTokenHash = this.hashRefreshToken(dto.refreshToken);

    const session = await this.prisma.systemSession.findUnique({
      where: {
        refreshTokenHash,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (session.revokedAt) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Refresh token has expired");
    }

    const user = session.user;

    this.assertActiveUser(user);

    let businessId: number | null = null;
    let selectedBusiness: AuthBusiness | null = null;

    if (dto.businessId) {
      selectedBusiness = await this.findAccessibleBusiness(
        user.id,
        dto.businessId,
      );

      if (!selectedBusiness) {
        throw new ForbiddenException("You do not have access to this business");
      }

      businessId = selectedBusiness.id;
    }

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      type: user.type,
      businessId,
    });

    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashRefreshToken(newRefreshToken);

    await this.prisma.$transaction([
      this.prisma.systemSession.update({
        where: {
          id: session.id,
        },
        data: {
          revokedAt: new Date(),
        },
      }),

      this.prisma.systemSession.create({
        data: {
          userId: user.id,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: this.getRefreshTokenExpiresAt(),
        },
      }),
    ]);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      selectedBusiness,
      user: this.toSafeUser(user),
    };
  }

  async selectStore(userId: number, businessId: number) {
    const user = await this.prisma.systemUser.findUnique({
      where: {
        id: userId,
      },
      omit: {
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid authenticated user");
    }

    if (user.status !== SystemUserStatus.ACTIVE) {
      throw new ForbiddenException("User account is not active");
    }

    const business = await this.findAccessibleBusiness(userId, businessId);

    if (!business) {
      throw new ForbiddenException("You do not have access to this business");
    }

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      type: user.type,
      businessId: business.id,
    });

    return {
      accessToken,
      selectedBusiness: business,
      user,
    };
  }

  async me(userId: number, businessId: number | null) {
    const user = await this.prisma.systemUser.findUnique({
      where: {
        id: userId,
      },
      omit: {
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid authenticated user");
    }

    const businesses = await this.prisma.business.findMany({
      where: {
        OR: [
          {
            ownerUserId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        ownerUserId: true,
        members: {
          where: {
            userId,
          },
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    let selectedBusiness: AuthBusiness | null = null;

    if (businessId) {
      selectedBusiness = await this.findAccessibleBusiness(userId, businessId);
    }

    if (user.type === SystemUserType.TENANT) {
      return {
        user,
        selectedBusiness,
        businesses,
      };
    }

    return {
      user,
      selectedBusiness,
    };
  }

  async getTenants() {
    return this.prisma.systemUser.findMany({
      where: { type: SystemUserType.TENANT },
      omit: { passwordHash: true },
      include: {
        _count: {
          select: { ownedBusinesses: true, memberships: true },
        },
      },
    });
  }

  private async issueTokenPair(payload: JwtPayload) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    await this.prisma.systemSession.create({
      data: {
        userId: payload.sub,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: this.getRefreshTokenExpiresAt(),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  private generateRefreshToken() {
    return randomBytes(64).toString("hex");
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  private getRefreshTokenExpiresAt() {
    const days =
      Number(this.configService.get<string>("JWT_REFRESH_EXPIRES_IN_DAYS")) ||
      30;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    return expiresAt;
  }

  private async findAccessibleBusiness(
    userId: number,
    businessId: number,
  ): Promise<AuthBusiness | null> {
    return this.prisma.business.findFirst({
      where: {
        id: businessId,
        OR: [
          {
            ownerUserId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        ownerUserId: true,
        members: {
          where: {
            userId,
          },
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
  }

  private assertActiveUser(user: Pick<SystemUser, "status">) {
    if (user.status === SystemUserStatus.SUSPENDED) {
      throw new ForbiddenException("Your account has been suspended");
    }

    if (user.status === SystemUserStatus.INACTIVE) {
      throw new ForbiddenException("Your account is inactive");
    }

    if (user.status !== SystemUserStatus.ACTIVE) {
      throw new ForbiddenException("User account is not active");
    }
  }

  private toSafeUser(user: SystemUser): SafeSystemUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
