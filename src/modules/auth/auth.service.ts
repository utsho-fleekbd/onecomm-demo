import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "node:crypto";
import { SystemUser, SystemUserStatus, SystemUserType } from "@prisma/client";
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./strategies/jwt.strategy";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { SelectBusinessDto } from "./dto/select-business.dto";
import { BusinessService } from "../business/business.service";

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
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prisma.systemUser.create({
      data: {
        name: dto.name,
        email,
        passwordHash,

        type: SystemUserType.TENANT,
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

    const selectedBusiness = this.businessService.create(user.id, {
      name: dto.businessName,
    });

    return {
      selectedBusiness,
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

    const isPasswordMatched = await this.verifyPassword(
      user.passwordHash,
      dto.password,
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

    const businesses = await this.findAccessibleBusinesses(user.id);

    if (businesses.length === 0) {
      throw new ForbiddenException("You are not assigned to any business");
    }

    const selectedBusiness = businesses[0];

    const tokens = await this.issueTokenPair({
      sub: user.id,
      type: user.type,
      businessId: selectedBusiness.id,
    });

    return {
      ...tokens,
      selectedBusiness,
      businesses,
      user: safeUser,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const now = new Date();
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
      await this.revokeAllUserSessions(session.userId);

      throw new UnauthorizedException("Refresh token reuse detected");
    }

    if (session.expiresAt <= now) {
      await this.prisma.systemSession.updateMany({
        where: {
          id: session.id,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });

      throw new UnauthorizedException("Refresh token has expired");
    }

    const user = session.user;

    this.assertActiveUser(user);

    const requestedBusinessId = dto.businessId ?? session.businessId;

    const selectedBusiness = await this.resolveSelectedBusiness(
      user.id,
      user.type,
      requestedBusinessId,
    );

    const tokenBusinessId = selectedBusiness?.id ?? null;

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      type: user.type,
      businessId: tokenBusinessId,
    });

    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashRefreshToken(newRefreshToken);
    const newRefreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    await this.prisma.$transaction(async (tx) => {
      const revokedSession = await tx.systemSession.updateMany({
        where: {
          id: session.id,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });

      if (revokedSession.count !== 1) {
        throw new UnauthorizedException("Refresh token has already been used");
      }

      await tx.systemSession.create({
        data: {
          userId: user.id,
          businessId: tokenBusinessId,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newRefreshTokenExpiresAt,
        },
      });
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      selectedBusiness,
      user: this.toSafeUser(user),
    };
  }

  async selectBusiness(userId: number, dto: SelectBusinessDto) {
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

    this.assertActiveUser(user);

    const business = await this.findAccessibleBusiness(userId, dto.businessId);

    if (!business) {
      throw new ForbiddenException("You do not have access to this business");
    }

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      type: user.type,
      businessId: business.id,
    });

    await this.bindRefreshSessionToBusiness(
      user.id,
      dto.refreshToken,
      business.id,
    );

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

    this.assertActiveUser(user);

    if (user.type === SystemUserType.ADMIN) {
      return {
        user,
        selectedBusiness: null,
      };
    }

    const businesses = await this.findAccessibleBusinesses(userId);

    if (businesses.length === 0) {
      throw new ForbiddenException("You are not assigned to any business");
    }

    let selectedBusiness: AuthBusiness | null = null;

    if (businessId !== null) {
      selectedBusiness =
        businesses.find((business) => business.id === businessId) ?? null;

      if (!selectedBusiness) {
        throw new ForbiddenException(
          "You no longer have access to this business",
        );
      }
    }

    return {
      user,
      selectedBusiness,
      businesses,
    };
  }

  async logout(dto: LogoutDto, userId?: number) {
    const refreshTokenHash = this.hashRefreshToken(dto.refreshToken);

    await this.prisma.systemSession.updateMany({
      where: {
        refreshTokenHash,
        revokedAt: null,
        ...(userId !== undefined ? { userId } : {}),
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      message: "Logged out successfully",
    };
  }

  async logoutAll(userId: number) {
    await this.revokeAllUserSessions(userId);

    return {
      message: "Logged out from all devices successfully",
    };
  }

  private async issueTokenPair(payload: JwtPayload) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    await this.prisma.systemSession.create({
      data: {
        userId: payload.sub,
        businessId: payload.businessId ?? null,
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
    const rawDays = this.configService.getOrThrow<string>(
      "JWT_REFRESH_EXPIRES_IN_DAYS",
    );

    const days = Number(rawDays);

    if (!Number.isInteger(days) || days <= 0) {
      throw new Error("JWT_REFRESH_EXPIRES_IN_DAYS must be a positive integer");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    return expiresAt;
  }

  private async resolveSelectedBusiness(
    userId: number,
    userType: SystemUserType,
    requestedBusinessId: number | null,
  ): Promise<AuthBusiness | null> {
    if (userType === SystemUserType.ADMIN) {
      return null;
    }

    if (requestedBusinessId !== null) {
      const business = await this.findAccessibleBusiness(
        userId,
        requestedBusinessId,
      );

      if (!business) {
        throw new ForbiddenException("You do not have access to this business");
      }

      return business;
    }

    const businesses = await this.findAccessibleBusinesses(userId);

    if (businesses.length === 0) {
      throw new ForbiddenException("You are not assigned to any business");
    }

    return businesses[0];
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
      select: this.getBusinessSelect(userId),
    });
  }

  private async findAccessibleBusinesses(
    userId: number,
  ): Promise<AuthBusiness[]> {
    return this.prisma.business.findMany({
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
      select: this.getBusinessSelect(userId),
      orderBy: {
        id: "asc",
      },
    });
  }

  private async bindRefreshSessionToBusiness(
    userId: number,
    refreshToken: string,
    businessId: number,
  ) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    await this.prisma.systemSession.updateMany({
      where: {
        userId,
        refreshTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        businessId,
      },
    });
  }

  private async revokeAllUserSessions(userId: number) {
    await this.prisma.systemSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private getBusinessSelect(userId: number) {
    return {
      id: true,
      name: true,
      ownerUserId: true,
      members: {
        where: {
          userId,
        },
      },
    } as const;
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
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  private async verifyPassword(passwordHash: string, password: string) {
    try {
      return await argon2.verify(passwordHash, password);
    } catch {
      return false;
    }
  }
}
