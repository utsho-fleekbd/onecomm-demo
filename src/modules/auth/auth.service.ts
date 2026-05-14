import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes, randomInt } from "node:crypto";
import {
  BusinessMemberStatus,
  BusinessStatus,
  OtpPurpose,
  SystemUser,
  SystemUserStatus,
  SystemUserType,
} from "@prisma/client";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { apiResponse } from "../../common/utils/api-response.util";
import type { CurrentUserPayload } from "./decorators/current-user.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { MailService } from "../mail/mail.service";
import { VerifyRegisterDto } from "./dto/verify-register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { VerifyResetOtpDto } from "./dto/verify-reset-otp.dto";
import { ResetForgotPasswordDto } from "./dto/reset-forgot-password.dto";
import { RequestChangeEmailDto } from "./dto/request-change-email.dto";
import { VerifyChangeEmailDto } from "./dto/verify-change-email.dto";

type SafeSystemUser = Omit<SystemUser, "passwordHash">;

type AuthBusiness = {
  id: string;
  ownerUserId: string;
  members: {
    id: string;
    userId: string;
  }[];
};

const ACCESSIBLE_BUSINESS_STATUSES = [
  BusinessStatus.TRIAL,
  BusinessStatus.ACTIVE,
] satisfies BusinessStatus[];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly businessService: BusinessService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);

    const existingUser = await this.prisma.systemUser.findUnique({
      where: { email },
      select: {
        id: true,
        status: true,
        ownedBusinesses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (existingUser && existingUser.status !== SystemUserStatus.INACTIVE) {
      throw new ConflictException("Email already exists");
    }

    if (existingUser?.status === SystemUserStatus.INACTIVE) {
      const oldUserId = existingUser.id;
      const ownedBusinessIds = existingUser.ownedBusinesses.map(
        (business) => business.id,
      );

      await this.prisma.$transaction(
        async (tx) => {
          if (ownedBusinessIds.length > 0) {
            await tx.businessSetting.deleteMany({
              where: {
                businessId: {
                  in: ownedBusinessIds,
                },
              },
            });

            await tx.businessBranding.deleteMany({
              where: {
                businessId: {
                  in: ownedBusinessIds,
                },
              },
            });

            await tx.systemSession.deleteMany({
              where: {
                businessId: {
                  in: ownedBusinessIds,
                },
              },
            });

            await tx.business.deleteMany({
              where: {
                id: {
                  in: ownedBusinessIds,
                },
              },
            });
          }

          await tx.systemEmailVerification.deleteMany({
            where: {
              userId: oldUserId,
            },
          });

          await tx.systemSession.deleteMany({
            where: {
              userId: oldUserId,
            },
          });

          await tx.systemUser.delete({
            where: {
              id: oldUserId,
            },
          });
        },
        {
          maxWait: 10000,
          timeout: 15000,
        },
      );
    }

    const otp = this.generateOtp();
    const otpHash = await this.hashPassword(otp);
    const passwordHash = await this.hashPassword(dto.password);
    const expiresAt = this.getOtpExpiresAt();

    const result = await this.prisma.$transaction(
      async (tx) => {
        const user = await tx.systemUser.create({
          data: {
            name: dto.name,
            email,
            passwordHash,
            status: SystemUserStatus.INACTIVE,
            type: SystemUserType.TENANT,
            emailVerifiedAt: null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            type: true,
            status: true,
            emailVerifiedAt: true,
            createdAt: true,
          },
        });

        await tx.systemEmailVerification.create({
          data: {
            userId: user.id,
            otpHash,
            purpose: OtpPurpose.EMAIL_VERIFICATION,
            expiresAt,
          },
        });

        let selectedBusiness: unknown = null;

        if (dto.businessName?.trim()) {
          const selectedBusinessResponse = await this.businessService.create(
            user.id,
            user.type,
            {
              name: dto.businessName,
            },
            tx,
          );

          selectedBusiness = selectedBusinessResponse.data;
        }

        return {
          user,
          selectedBusiness,
        };
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    );

    await this.mailService.sendRegisterOtpEmail(email, otp);

    return apiResponse(
      result,
      "Registration successful. Please verify your email.",
    );
  }

  async verifyRegister(dto: VerifyRegisterDto) {
    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        status: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.emailVerifiedAt) {
      return apiResponse(null, "Email already verified");
    }

    const verification = await this.prisma.systemEmailVerification.findFirst({
      where: {
        userId: user.id,
        purpose: OtpPurpose.EMAIL_VERIFICATION,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verification) {
      throw new BadRequestException("OTP is invalid or expired");
    }

    if (verification.attemptCount >= 5) {
      throw new BadRequestException(
        "Too many attempts. Please request a new OTP",
      );
    }

    const isOtpMatched = await this.verifyPassword(
      verification.otpHash,
      dto.otp,
    );

    if (!isOtpMatched) {
      await this.prisma.systemEmailVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          attemptCount: {
            increment: 1,
          },
        },
      });

      throw new BadRequestException("Invalid OTP");
    }

    await this.prisma.$transaction([
      this.prisma.systemEmailVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          verifiedAt: new Date(),
        },
      }),

      this.prisma.systemUser.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerifiedAt: new Date(),
          status: SystemUserStatus.ACTIVE,
        },
      }),
    ]);

    return apiResponse({ success: "true" }, "Email verified successfully");
  }

  async checkEmail(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.systemUser.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (user?.status === "INACTIVE") {
      return {
        success: true,
        message: "Email is available",
        data: {
          exists: false,
          available: true,
        },
      };
    }

    return {
      success: true,
      message: user ? "Email already exists" : "Email is available",
      data: {
        exists: Boolean(user),
        available: !user,
      },
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

      return apiResponse({
        ...tokens,
        selectedBusiness: null,
        user: safeUser,
      });
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

    return apiResponse({
      ...tokens,
      selectedBusiness,
      businesses,
      user: safeUser,
    });
  }

  async requestChangeEmail(userId: string, dto: RequestChangeEmailDto) {
    const newEmail = this.normalizeEmail(dto.newEmail);

    const user = await this.prisma.systemUser.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.email === newEmail) {
      throw new BadRequestException("New email must be different");
    }

    const existingUser = await this.prisma.systemUser.findFirst({
      where: {
        email: newEmail,
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const otp = this.generateOtp();
    const otpHash = await this.hashPassword(otp);
    const expiresAt = this.getOtpExpiresAt();

    const verification = await this.prisma.systemEmailVerification.create({
      data: {
        userId,
        otpHash,
        purpose: OtpPurpose.EMAIL_CHANGE,
        expiresAt,
      },
      select: {
        id: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    await this.mailService.sendChangeEmailOtpEmail(newEmail, otp);

    return apiResponse(
      {
        verificationId: verification.id,
        email: newEmail,
        expiresAt: verification.expiresAt,
      },
      "OTP sent to new email successfully",
    );
  }

  async verifyChangeEmail(userId: string, dto: VerifyChangeEmailDto) {
    const newEmail = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.email === newEmail) {
      throw new BadRequestException("New email must be different");
    }

    const existingUser = await this.prisma.systemUser.findFirst({
      where: {
        email: newEmail,
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const verification = await this.prisma.systemEmailVerification.findFirst({
      where: {
        userId,
        purpose: OtpPurpose.EMAIL_CHANGE,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        otpHash: true,
        expiresAt: true,
        attemptCount: true,
        createdAt: true,
      },
    });

    if (!verification) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    const isOtpValid = await this.verifyPassword(verification.otpHash, dto.otp);

    if (!isOtpValid) {
      throw new BadRequestException("Invalid OTP");
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.systemUser.update({
        where: {
          id: userId,
        },
        data: {
          email: newEmail,
          emailVerifiedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          type: true,
          status: true,
          emailVerifiedAt: true,
          profile: true,
        },
      });

      await tx.systemEmailVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          verifiedAt: new Date(),
        },
      });

      return updated;
    });

    return apiResponse(updatedUser, "Email updated successfully");
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    this.assertActiveUser(user);

    const otp = this.generateOtp();
    const otpHash = await this.hashPassword(otp);
    const expiresAt = this.getOtpExpiresAt();

    await this.prisma.systemPasswordReset.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    await this.mailService.sendForgotPasswordOtpEmail(email, otp);

    return apiResponse(
      { success: true },
      "Password reset OTP sent successfully",
    );
  }

  async verifyResetOtp(dto: VerifyResetOtpDto) {
    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findUnique({
      where: { email },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid email or OTP");
    }

    this.assertActiveUser(user);

    const resetRecord = await this.prisma.systemPasswordReset.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!resetRecord) {
      throw new BadRequestException("OTP is invalid or expired");
    }

    if (resetRecord.attemptCount >= 5) {
      throw new BadRequestException(
        "Too many attempts. Please request a new OTP",
      );
    }

    const isOtpMatched = await this.verifyPassword(
      resetRecord.otpHash,
      dto.otp,
    );

    if (!isOtpMatched) {
      await this.prisma.systemPasswordReset.update({
        where: {
          id: resetRecord.id,
        },
        data: {
          attemptCount: {
            increment: 1,
          },
        },
      });

      throw new BadRequestException("Invalid OTP");
    }

    const verification = await this.prisma.systemEmailVerification.create({
      data: {
        userId: user.id,
        otpHash: resetRecord.otpHash,
        purpose: OtpPurpose.PASSWORD_RESET,
        expiresAt: resetRecord.expiresAt,
        verifiedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return apiResponse(
      {
        verificationId: verification.id,
      },
      "OTP verified successfully",
    );
  }

  async resetForgotPassword(dto: ResetForgotPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        "New password and confirm password do not match",
      );
    }

    const email = this.normalizeEmail(dto.email);

    const user = await this.prisma.systemUser.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid reset request");
    }

    this.assertActiveUser(user);

    const verification = await this.prisma.systemEmailVerification.findFirst({
      where: {
        id: dto.verificationId,
        userId: user.id,
        purpose: OtpPurpose.PASSWORD_RESET,
        verifiedAt: {
          not: null,
        },
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      throw new BadRequestException("OTP verification is invalid or expired");
    }

    const resetRecord = await this.prisma.systemPasswordReset.findFirst({
      where: {
        userId: user.id,
        otpHash: verification.otpHash,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!resetRecord) {
      throw new BadRequestException("Reset request is invalid or expired");
    }

    const isSamePassword = await this.verifyPassword(
      user.passwordHash,
      dto.newPassword,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        "New password must be different from old password",
      );
    }

    const passwordHash = await this.hashPassword(dto.newPassword);

    await this.prisma.$transaction([
      this.prisma.systemUser.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
        },
      }),

      this.prisma.systemPasswordReset.update({
        where: {
          id: resetRecord.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      this.prisma.systemSession.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    return apiResponse({ success: true }, "Password reset successfully");
  }

  async resetPassword(user: CurrentUserPayload, dto: ResetPasswordDto) {
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(
        "New password must be different from old password",
      );
    }

    const existingUser = await this.prisma.systemUser.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedException("Invalid authenticated user");
    }

    this.assertActiveUser(existingUser);

    const isOldPasswordMatched = await this.verifyPassword(
      existingUser.passwordHash,
      dto.oldPassword,
    );

    if (!isOldPasswordMatched) {
      throw new UnauthorizedException("Old password is incorrect");
    }

    const newPasswordHash = await this.hashPassword(dto.newPassword);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const result = await this.prisma.systemUser.update({
      where: {
        id: existingUser.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    console.log("password", isOldPasswordMatched);

    return apiResponse(result, "password successful");
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

    return apiResponse({
      accessToken,
      refreshToken: newRefreshToken,
      selectedBusiness,
      user: this.toSafeUser(user),
    });
  }

  async selectBusiness(userId: string, dto: SelectBusinessDto) {
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

    return apiResponse({
      accessToken,
      selectedBusiness: business,
      user,
    });
  }

  async me(user: CurrentUserPayload) {
    if (user.type === SystemUserType.ADMIN) {
      return apiResponse({
        user,
        selectedBusiness: null,
      });
    }

    const businesses = await this.findAccessibleBusinesses(user.id);

    const profile = await this.prisma.systemUserProfile.findFirst({
      where: { userId: user.id },
    });

    if (businesses.length === 0) {
      throw new ForbiddenException("You are not assigned to any business");
    }

    let selectedBusiness: AuthBusiness | null = null;

    if (user.businessId !== null) {
      selectedBusiness =
        businesses.find((business) => business.id === user.businessId) ?? null;

      if (!selectedBusiness) {
        throw new ForbiddenException(
          "You no longer have access to this business",
        );
      }
    }

    return apiResponse({
      user,
      profile,
      selectedBusiness,
      businesses,
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.systemUser.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.phone) {
      const phoneExists = await this.prisma.systemUser.findFirst({
        where: {
          phone: dto.phone,
          deletedAt: null,
          id: {
            not: userId,
          },
        },
        select: {
          id: true,
        },
      });

      if (phoneExists) {
        throw new ConflictException("Phone already exists");
      }
    }

    if (dto.profile && !user.profile) {
      throw new NotFoundException("User profile not found");
    }

    const profilePayload = dto.profile
      ? {
          ...dto.profile,
          dateOfBirth: dto.profile.dateOfBirth
            ? new Date(dto.profile.dateOfBirth)
            : undefined,
        }
      : undefined;

    const updatedUser = await this.prisma.systemUser.update({
      where: {
        id: userId,
      },
      data: {
        name: dto.name,
        phone: dto.phone,

        profile: profilePayload
          ? {
              update: profilePayload,
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        profile: true,
      },
    });

    return apiResponse(updatedUser, "User updated successfully");
  }

  async logout(dto: LogoutDto, userId?: string) {
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

    return apiResponse(null, "Logged out successfully");
  }

  async logoutAll(userId: string) {
    await this.revokeAllUserSessions(userId);

    return apiResponse(null, "Logged out from all devices successfully");
  }

  private generateOtp() {
    return String(randomInt(100000, 1000000));
  }

  private getOtpExpiresAt() {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    return expiresAt;
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
    userId: string,
    userType: SystemUserType,
    requestedBusinessId: string | null,
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
    userId: string,
    businessId: string,
  ): Promise<AuthBusiness | null> {
    return this.prisma.business.findFirst({
      where: {
        id: businessId,
        deletedAt: null,
        status: {
          in: ACCESSIBLE_BUSINESS_STATUSES,
        },
        OR: [
          {
            ownerUserId: userId,
          },
          {
            members: {
              some: {
                userId,
                status: BusinessMemberStatus.ACTIVE,
                deletedAt: null,
              },
            },
          },
        ],
      },
      select: this.getBusinessSelect(userId),
    });
  }

  private async findAccessibleBusinesses(
    userId: string,
  ): Promise<AuthBusiness[]> {
    return this.prisma.business.findMany({
      where: {
        deletedAt: null,
        status: {
          in: ACCESSIBLE_BUSINESS_STATUSES,
        },
        OR: [
          {
            ownerUserId: userId,
          },
          {
            members: {
              some: {
                userId,
                status: BusinessMemberStatus.ACTIVE,
                deletedAt: null,
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
    userId: string,
    refreshToken: string,
    businessId: string,
  ) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const result = await this.prisma.systemSession.updateMany({
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

    if (result.count !== 1) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private async revokeAllUserSessions(userId: string) {
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

  private getBusinessSelect(userId: string) {
    return {
      id: true,
      name: true,
      ownerUserId: true,
      members: {
        where: {
          userId,
          status: BusinessMemberStatus.ACTIVE,
          deletedAt: null,
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
    const { ...safeUser } = user;
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
