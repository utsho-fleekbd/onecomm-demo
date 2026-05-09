import { Request } from "express";
import { Reflector } from "@nestjs/core";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PermissionService } from "../permission.service";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";
import {
  REQUIRED_PERMISSION_KEY,
  RequiredPermissionMeta,
} from "../decorators/require-permission.decorator";

type AuthenticatedRequest = Request & {
  user?: CurrentUserPayload;
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermissionMeta>(
        REQUIRED_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!user.businessId) {
      throw new ForbiddenException("You do not have access to this business");
    }

    await this.permissionService.assertPermission(
      user,
      user.businessId,
      requiredPermission.feature,
      requiredPermission.action,
    );

    return true;
  }
}
