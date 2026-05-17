import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { SystemUserType } from "@prisma/client";

import { PackageSubscriptionService } from "../package-subscription.service";
import type { CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptions: PackageSubscriptionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      user?: CurrentUserPayload;
    }>();

    const user = request.user;

    // TODO: not user and return true? ain't it a bit risky?
    if (!user || user.type === SystemUserType.ADMIN) {
      return true;
    }

    await this.subscriptions.assertTenantSubscriptionActive(user);

    return true;
  }
}
