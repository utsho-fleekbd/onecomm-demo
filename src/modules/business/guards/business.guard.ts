import { Reflector } from "@nestjs/core";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { BusinessService } from "../business.service";
import { AuthenticatedRequest } from "../../auth/strategies/jwt.strategy";

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

    if (!user.businessId) {
      throw new ForbiddenException("You do not have access to this business");
    }

    await this.businessService.assertCanManageBusiness(user, user.businessId);

    return true;
  }
}
