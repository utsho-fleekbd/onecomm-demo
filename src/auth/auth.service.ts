import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { StoresService } from "../stores/stores.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly storeService: StoresService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.TENANT,
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

    await this.storeService.create(user.id, {
      name: "Neon Store",
    });

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
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

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
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
  }

  private async generateAccessToken(user: {
    id: string;
    email: string;
    role: UserRole;
  }) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
