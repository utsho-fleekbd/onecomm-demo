import { Request } from "express";
import { Reflector } from "@nestjs/core";
import {
  BadRequestException,
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
import { SystemUserType } from "@prisma/client";

type AuthenticatedRequest = Request & {
  user?: CurrentUserPayload;
  businessId?: number | null;
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

    const businessId = this.getTargetBusinessId(request, requiredPermission);

    if (businessId === null) {
      request.businessId = null;

      return true;
    }

    await this.permissionService.assertPermission(
      user,
      businessId,
      requiredPermission.feature,
      requiredPermission.action,
    );

    request.businessId = businessId;

    return true;
  }

  private getTargetBusinessId(
    request: AuthenticatedRequest,
    requiredPermission: RequiredPermissionMeta,
  ) {
    const rawParam = request.params?.[requiredPermission.businessIdParam];

    if (rawParam !== undefined) {
      const businessId = Number(rawParam);

      if (!Number.isInteger(businessId) || businessId <= 0) {
        throw new BadRequestException("Invalid business ID");
      }

      return businessId;
    }

    if (request.user?.type === SystemUserType.ADMIN) {
      return null;
    }

    if (!request.user?.businessId) {
      throw new ForbiddenException("You do not have access to this business");
    }

    return request.user.businessId;
  }
}
