import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  PackageBillingCycle,
  PackageSubscriptionAddonStatus,
  PackageSubscriptionStatus,
  PackageStatus,
  Prisma,
  SystemUserType,
} from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

const ACTIVE_SUBSCRIPTION_STATUSES = [
  PackageSubscriptionStatus.TRIALING,
  PackageSubscriptionStatus.ACTIVE,
  PackageSubscriptionStatus.PAST_DUE,
] satisfies PackageSubscriptionStatus[];

const DEFAULT_TRIAL_DAYS = 7;

export const PACKAGE_SUBSCRIPTION_INCLUDE = {
  package: {
    include: {
      limits: true,
    },
  },
  addons: {
    where: {
      status: PackageSubscriptionAddonStatus.ACTIVE,
    },
    include: {
      addon: true,
    },
  },
} satisfies Prisma.PackageSubscriptionInclude;

@Injectable()
export class PackageSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  resolveTenantId(
    user: Pick<CurrentUserPayload, "id" | "type" | "tenantId">,
  ): string | null {
    if (user.type === SystemUserType.ADMIN) {
      return null;
    }

    if (user.type === SystemUserType.TENANT) {
      return user.id;
    }

    return user.tenantId;
  }

  async assertTenantSubscriptionActive(
    user: Pick<CurrentUserPayload, "id" | "type" | "tenantId">,
  ) {
    if (user.type === SystemUserType.ADMIN) {
      return null;
    }

    const tenantId = this.resolveTenantId(user);

    if (!tenantId) {
      throw new ForbiddenException("Tenant subscription context is missing");
    }

    return this.assertTenantCanAccess(tenantId);
  }

  async assertTenantCanAccess(tenantId: string) {
    const subscription = await this.findCurrentSubscription(tenantId);

    if (!subscription) {
      throw new ForbiddenException(
        "Tenant does not have an active subscription",
      );
    }

    const now = new Date();

    if (subscription.currentPeriodEnd <= now) {
      await this.prisma.packageSubscription.updateMany({
        where: {
          id: subscription.id,
          status: {
            in: ACTIVE_SUBSCRIPTION_STATUSES,
          },
        },
        data: {
          status: PackageSubscriptionStatus.EXPIRED,
          endedAt: now,
          endReason: "Subscription period expired",
        },
      });

      throw new ForbiddenException("Tenant subscription has expired");
    }

    return subscription;
  }

  async findCurrentSubscription(tenantId: string) {
    return this.prisma.packageSubscription.findFirst({
      where: {
        tenantId,
        status: {
          in: ACTIVE_SUBSCRIPTION_STATUSES,
        },
      },
      include: PACKAGE_SUBSCRIPTION_INCLUDE,
      orderBy: {
        currentPeriodEnd: "desc",
      },
    });
  }

  async assignDefaultTrial(tenantId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    const existingSubscription = await client.packageSubscription.findFirst({
      where: {
        tenantId,
        status: {
          in: ACTIVE_SUBSCRIPTION_STATUSES,
        },
      },
      orderBy: {
        currentPeriodEnd: "desc",
      },
    });

    if (existingSubscription) {
      return existingSubscription;
    }

    const plan = await client.packagePlan.findFirst({
      where: {
        isDefault: true,
        status: PackageStatus.ACTIVE,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    if (!plan) {
      throw new InternalServerErrorException(
        "Unable to continue because no default package plan is configured.",
      );
    }
    const now = new Date();
    const trialDays =
      plan.freeTrialDays > 0 ? plan.freeTrialDays : DEFAULT_TRIAL_DAYS;
    const trialEndsAt = this.addDays(now, trialDays);

    return client.packageSubscription.create({
      data: {
        tenantId,
        packageId: plan.id,
        status: PackageSubscriptionStatus.TRIALING,
        billingCycle: plan.billingCycle,
        price: plan.price,
        currencyCode: plan.currencyCode,
        startedAt: now,
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
      },
    });
  }

  async replaceCurrentSubscription(
    tenantId: string,
    planId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const plan = await client.packagePlan.findFirst({
      where: {
        id: planId,
        status: PackageStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (!plan) {
      throw new NotFoundException("Package plan not found");
    }

    const now = new Date();
    const currentPeriodEnd = this.getPeriodEnd(now, plan.billingCycle);

    await client.packageSubscription.updateMany({
      where: {
        tenantId,
        status: {
          in: ACTIVE_SUBSCRIPTION_STATUSES,
        },
      },
      data: {
        status: PackageSubscriptionStatus.CANCELLED,
        endedAt: now,
        endReason: "Changed package plan",
      },
    });

    return client.packageSubscription.create({
      data: {
        tenantId,
        packageId: plan.id,
        status: PackageSubscriptionStatus.ACTIVE,
        billingCycle: plan.billingCycle,
        price: plan.price,
        currencyCode: plan.currencyCode,
        startedAt: now,
        currentPeriodStart: now,
        currentPeriodEnd,
      },
      include: PACKAGE_SUBSCRIPTION_INCLUDE,
    });
  }

  async cancelCurrentSubscription(tenantId: string, reason?: string) {
    const subscription = await this.findCurrentSubscription(tenantId);

    if (!subscription) {
      throw new NotFoundException("Active subscription not found");
    }

    return this.prisma.packageSubscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: PackageSubscriptionStatus.CANCELLED,
        endedAt: new Date(),
        endReason: reason?.trim() || "Cancelled by tenant",
      },
    });
  }

  private getPeriodEnd(start: Date, billingCycle: PackageBillingCycle) {
    if (
      billingCycle === PackageBillingCycle.FREE ||
      billingCycle === PackageBillingCycle.LIFETIME
    ) {
      return new Date("9999-12-31T23:59:59.999Z");
    }

    if (billingCycle === PackageBillingCycle.YEARLY) {
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      return end;
    }

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return end;
  }

  private addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }
}
