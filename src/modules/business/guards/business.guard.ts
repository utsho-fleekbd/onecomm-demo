import { Reflector } from "@nestjs/core";
import { isUUID } from "class-validator";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { BusinessService } from "../business.service";
import { AuthenticatedRequest } from "../../auth/strategies/jwt.strategy";
import {
  REQUIRED_PERMISSION_KEY,
  RequiredPermissionMeta,
} from "../../permissions/decorators/require-permission.decorator";
import { SystemUserType } from "@prisma/client";

@Injectable()
export class BusinessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly businessService: BusinessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    const businessId = this.getTargetBusinessId(context, request);

    if (businessId === null) {
      request.businessId = null;

      return true;
    }

    await this.businessService.assertCanAccessBusiness(user, businessId);

    request.businessId = businessId;

    return true;
  }

  private getTargetBusinessId(
    context: ExecutionContext,
    request: AuthenticatedRequest,
  ): string | null {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermissionMeta>(
        REQUIRED_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    const businessIdParam = requiredPermission?.businessIdParam ?? "businessId";
    const rawParam = request.params?.[businessIdParam];

    if (rawParam !== undefined) {
      const businessId = String(rawParam);

      if (!isUUID(businessId)) {
        throw new BadRequestException("Invalid business ID");
      }

      return businessId;
    }

    if (request.user.type === SystemUserType.ADMIN) {
      return null;
    }

    if (!request.user.businessId) {
      throw new ForbiddenException("You do not have access to this business");
    }

    return request.user.businessId;
  }
}
