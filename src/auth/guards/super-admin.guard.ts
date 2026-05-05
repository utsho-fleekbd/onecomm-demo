import { Request } from "express";
import { JwtPayload } from "../strategies/jwt.strategy";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PlatformRole } from "@prisma/client";

type AuthenticatedRequest = Request & { user: JwtPayload };

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (user.role !== PlatformRole.SUPER_ADMIN) {
      throw new ForbiddenException("Only super admin can access this resource");
    }

    return true;
  }
}
