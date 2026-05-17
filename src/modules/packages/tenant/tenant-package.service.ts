import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  PackagePaymentStatus,
  PackagePaymentType,
  PackageStatus,
  PackageSubscriptionAddonStatus,
  Prisma,
} from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";
import {
  apiResponse,
  paginatedResponse,
} from "../../../common/utils/api-response.util";
import { QueryPackageDto } from "../dto/query-package.dto";
import { PackageLimitService } from "../package-limit.service";
import { PackageSubscriptionService } from "../package-subscription.service";
import {
  CancelTenantSubscriptionDto,
  CheckoutPackageAddonDto,
} from "./dto/tenant-package.dto";

const MOCK_PAYMENT_EXPIRY_MINUTES = 15;

@Injectable()
export class TenantPackageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly limits: PackageLimitService,
    private readonly subscriptions: PackageSubscriptionService,
  ) {}

  async findAvailablePlans(query: QueryPackageDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PackagePlanWhereInput = {
      deletedAt: null,
      status: PackageStatus.ACTIVE,
      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const items = await this.prisma.packagePlan.findMany({
      where,
      skip,
      take: limit,
      include: {
        limits: true,
        features: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const total = await this.prisma.packagePlan.count({ where });

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findAvailableAddons(query: QueryPackageDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PackageAddonWhereInput = {
      deletedAt: null,
      status: PackageStatus.ACTIVE,
      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.packageAddon.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      this.prisma.packageAddon.count({ where }),
    ]);

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async getCurrentSubscription(tenantId: string) {
    const subscription =
      await this.subscriptions.findCurrentSubscription(tenantId);

    if (!subscription) {
      throw new NotFoundException("Current subscription not found");
    }

    return apiResponse(subscription);
  }

  async getSubscriptionHistory(tenantId: string, query: QueryPackageDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PackageSubscriptionWhereInput = {
      tenantId,
    };

    const [items, total] = await Promise.all([
      this.prisma.packageSubscription.findMany({
        where,
        skip,
        take: limit,
        include: {
          package: {
            include: {
              limits: true,
              features: {
                where: {
                  isActive: true,
                },
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
          addons: {
            include: {
              addon: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.packageSubscription.count({ where }),
    ]);

    return paginatedResponse(items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async getUsage(tenantId: string) {
    const usage = await this.limits.getUsageSummary(tenantId);

    return apiResponse(usage);
  }

  async checkoutPlan(tenantId: string, planId: string) {
    const plan = await this.prisma.packagePlan.findFirst({
      where: {
        id: planId,
        status: PackageStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (!plan) {
      throw new NotFoundException("Package plan not found");
    }

    const payment = await this.prisma.packageMockPayment.create({
      data: {
        tenantId,
        planId: plan.id,
        type: PackagePaymentType.PLAN_CHANGE,
        status: PackagePaymentStatus.PENDING,
        amount: plan.price,
        currencyCode: plan.currencyCode,
        expiresAt: this.getPaymentExpiry(),
      },
      include: {
        plan: {
          include: {
            limits: true,
            features: {
              where: {
                isActive: true,
              },
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    });

    return apiResponse(payment, "Package checkout created successfully");
  }

  async checkoutAddon(
    tenantId: string,
    addonId: string,
    dto: CheckoutPackageAddonDto,
  ) {
    const [subscription, addon] = await Promise.all([
      this.subscriptions.assertTenantCanAccess(tenantId),
      this.prisma.packageAddon.findFirst({
        where: {
          id: addonId,
          status: PackageStatus.ACTIVE,
          deletedAt: null,
        },
      }),
    ]);

    if (!addon) {
      throw new NotFoundException("Package add-on not found");
    }

    const quantity = dto.quantity ?? 1;
    const amount = Number(addon.price) * quantity;

    const payment = await this.prisma.packageMockPayment.create({
      data: {
        tenantId,
        subscriptionId: subscription.id,
        addonId: addon.id,
        type: PackagePaymentType.ADDON_PURCHASE,
        status: PackagePaymentStatus.PENDING,
        amount,
        currencyCode: addon.currencyCode,
        quantity,
        expiresAt: this.getPaymentExpiry(),
      },
      include: {
        addon: true,
      },
    });

    return apiResponse(payment, "Add-on checkout created successfully");
  }

  async confirmMockPayment(tenantId: string, paymentId: string) {
    const payment = await this.prisma.packageMockPayment.findFirst({
      where: {
        id: paymentId,
        tenantId,
      },
    });

    if (!payment) {
      throw new NotFoundException("Package mock payment not found");
    }

    if (payment.status !== PackagePaymentStatus.PENDING) {
      throw new ForbiddenException("Package mock payment is not pending");
    }

    if (payment.expiresAt <= new Date()) {
      await this.prisma.packageMockPayment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PackagePaymentStatus.EXPIRED,
        },
      });

      throw new ForbiddenException("Package mock payment has expired");
    }

    const activeSubscription =
      payment.type === PackagePaymentType.ADDON_PURCHASE
        ? await this.subscriptions.assertTenantCanAccess(tenantId)
        : null;

    const result = await this.prisma.$transaction(async (tx) => {
      if (payment.type === PackagePaymentType.PLAN_CHANGE) {
        if (!payment.planId) {
          throw new ForbiddenException("Payment plan is missing");
        }

        const subscription =
          await this.subscriptions.replaceCurrentSubscription(
            tenantId,
            payment.planId,
            tx,
          );

        const confirmedPayment = await tx.packageMockPayment.update({
          where: {
            id: payment.id,
          },
          data: {
            subscriptionId: subscription.id,
            status: PackagePaymentStatus.CONFIRMED,
            confirmedAt: new Date(),
          },
        });

        return {
          payment: confirmedPayment,
          subscription,
        };
      }

      if (!payment.addonId) {
        throw new ForbiddenException("Payment add-on is missing");
      }

      const subscriptionAddon = await tx.packageSubscriptionAddon.upsert({
        where: {
          subscriptionId_addonId: {
            subscriptionId: activeSubscription!.id,
            addonId: payment.addonId,
          },
        },
        create: {
          subscriptionId: activeSubscription!.id,
          addonId: payment.addonId,
          quantity: payment.quantity,
          price: payment.amount,
          currencyCode: payment.currencyCode,
        },
        update: {
          status: PackageSubscriptionAddonStatus.ACTIVE,
          quantity: {
            increment: payment.quantity,
          },
        },
        include: {
          addon: true,
        },
      });

      const confirmedPayment = await tx.packageMockPayment.update({
        where: {
          id: payment.id,
        },
        data: {
          subscriptionId: activeSubscription!.id,
          status: PackagePaymentStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      return {
        payment: confirmedPayment,
        subscriptionAddon,
      };
    });

    return apiResponse(result, "Package mock payment confirmed successfully");
  }

  async cancelSubscription(tenantId: string, dto: CancelTenantSubscriptionDto) {
    const subscription = await this.subscriptions.cancelCurrentSubscription(
      tenantId,
      dto.reason,
    );

    return apiResponse(subscription, "Subscription cancelled successfully");
  }

  async removeAddon(tenantId: string, subscriptionAddonId: string) {
    const subscription =
      await this.subscriptions.assertTenantCanAccess(tenantId);

    const subscriptionAddon =
      await this.prisma.packageSubscriptionAddon.findFirst({
        where: {
          id: subscriptionAddonId,
          subscriptionId: subscription.id,
          status: PackageSubscriptionAddonStatus.ACTIVE,
        },
      });

    if (!subscriptionAddon) {
      throw new NotFoundException("Active subscription add-on not found");
    }

    const removedAddon = await this.prisma.packageSubscriptionAddon.update({
      where: {
        id: subscriptionAddon.id,
      },
      data: {
        status: PackageSubscriptionAddonStatus.CANCELLED,
      },
    });

    return apiResponse(
      removedAddon,
      "Subscription add-on removed successfully",
    );
  }

  private getPaymentExpiry() {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + MOCK_PAYMENT_EXPIRY_MINUTES);
    return expiresAt;
  }
}
