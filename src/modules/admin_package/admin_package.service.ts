import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  PackageBillingCycle,
  PackageLimitKey,
  PackageResetCycle,
  PackageStatus,
  PackageSubscriptionAddonStatus,
  PackageSubscriptionStatus,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CancelPackageSubscriptionDto,
  ChangePackageSubscriptionPlanDto,
  CreatePackageAddonDto,
  CreatePackagePlanDto,
  CreatePackagePlanLimitDto,
  CreatePackageSubscriptionAddonDto,
  CreatePackageSubscriptionDto,
  IncrementPackageUsageDto,
  PaginationQueryDto,
  RenewPackageSubscriptionDto,
  UpdatePackageAddonDto,
  UpdatePackagePlanDto,
  UpdatePackagePlanLimitDto,
  UpdatePackageSubscriptionAddonDto,
  UpsertPackageUsageCounterDto,
} from "./dto/admin-package.dto";

@Injectable()
export class AdminPackageService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // PACKAGE PLANS
  // ======================================================

  async createPlan(dto: CreatePackagePlanDto) {
    try {
      return await this.prisma.packagePlan.create({
        data: {
          name: dto.name.trim(),
          description: dto.description,
          price: dto.price,
          billingCycle: dto.billingCycle,
          currencyCode: dto.currencyCode ?? "BDT",
          freeTrialDays: dto.freeTrialDays ?? 0,
          status: dto.status ?? PackageStatus.ACTIVE,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: {
          limits: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package plan");
    }
  }

  async findPlans(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PackagePlanWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.packagePlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          limits: {
            orderBy: {
              limitKey: "asc",
            },
          },
          _count: {
            select: {
              subscriptions: true,
            },
          },
        },
      }),
      this.prisma.packagePlan.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPlanById(id: string) {
    const plan = await this.prisma.packagePlan.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        limits: {
          orderBy: {
            limitKey: "asc",
          },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException("Package plan not found");
    }

    return plan;
  }

  async updatePlan(id: string, dto: UpdatePackagePlanDto) {
    await this.findPlanById(id);

    try {
      return await this.prisma.packagePlan.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
          ...(dto.price !== undefined ? { price: dto.price } : {}),
          ...(dto.billingCycle !== undefined
            ? { billingCycle: dto.billingCycle }
            : {}),
          ...(dto.currencyCode !== undefined
            ? { currencyCode: dto.currencyCode }
            : {}),
          ...(dto.freeTrialDays !== undefined
            ? { freeTrialDays: dto.freeTrialDays }
            : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        },
        include: {
          limits: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package plan");
    }
  }

  async deletePlan(id: string) {
    const plan = await this.findPlanById(id);

    if (plan._count.subscriptions > 0) {
      return this.prisma.packagePlan.update({
        where: { id },
        data: {
          status: PackageStatus.ARCHIVED,
          deletedAt: new Date(),
        },
      });
    }

    return this.prisma.packagePlan.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // ======================================================
  // PACKAGE PLAN LIMITS
  // ======================================================

  async createPlanLimit(packageId: string, dto: CreatePackagePlanLimitDto) {
    await this.findPlanById(packageId);

    try {
      return await this.prisma.packagePlanLimit.create({
        data: {
          packageId,
          limitKey: dto.limitKey,
          limitValue: dto.limitValue,
          resetCycle: dto.resetCycle ?? PackageResetCycle.LIFETIME,
          description: dto.description,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package plan limit");
    }
  }

  async findPlanLimits(packageId: string) {
    await this.findPlanById(packageId);

    return this.prisma.packagePlanLimit.findMany({
      where: { packageId },
      orderBy: {
        limitKey: "asc",
      },
    });
  }

  async updatePlanLimit(limitId: string, dto: UpdatePackagePlanLimitDto) {
    const existingLimit = await this.findPlanLimitById(limitId);

    if (dto.limitKey && dto.limitKey !== existingLimit.limitKey) {
      const duplicateLimit = await this.prisma.packagePlanLimit.findFirst({
        where: {
          packageId: existingLimit.packageId,
          limitKey: dto.limitKey,
          id: {
            not: limitId,
          },
        },
      });

      if (duplicateLimit) {
        throw new ConflictException("Package plan limit already exists");
      }
    }

    try {
      return await this.prisma.packagePlanLimit.update({
        where: { id: limitId },
        data: {
          ...(dto.limitKey !== undefined ? { limitKey: dto.limitKey } : {}),
          ...(dto.limitValue !== undefined
            ? { limitValue: dto.limitValue }
            : {}),
          ...(dto.resetCycle !== undefined
            ? { resetCycle: dto.resetCycle }
            : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package plan limit");
    }
  }

  async deletePlanLimit(limitId: string) {
    await this.findPlanLimitById(limitId);

    return this.prisma.packagePlanLimit.delete({
      where: { id: limitId },
    });
  }

  // ======================================================
  // ADDONS
  // ======================================================

  async createAddon(dto: CreatePackageAddonDto) {
    try {
      return await this.prisma.packageAddon.create({
        data: {
          name: dto.name.trim(),
          description: dto.description,
          price: dto.price,
          billingCycle: dto.billingCycle,
          currencyCode: dto.currencyCode ?? "BDT",
          limitKey: dto.limitKey,
          limitValue: dto.limitValue,
          resetCycle: dto.resetCycle ?? PackageResetCycle.LIFETIME,
          status: dto.status ?? PackageStatus.ACTIVE,
          sortOrder: dto.sortOrder ?? 0,
          createdBy: dto.createdBy,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package addon");
    }
  }

  async findAddons(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PackageAddonWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.packageAddon.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          _count: {
            select: {
              subscriptions: true,
            },
          },
        },
      }),
      this.prisma.packageAddon.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAddonById(id: string) {
    const addon = await this.prisma.packageAddon.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!addon) {
      throw new NotFoundException("Package addon not found");
    }

    return addon;
  }

  async updateAddon(id: string, dto: UpdatePackageAddonDto) {
    await this.findAddonById(id);

    try {
      return await this.prisma.packageAddon.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
          ...(dto.price !== undefined ? { price: dto.price } : {}),
          ...(dto.billingCycle !== undefined
            ? { billingCycle: dto.billingCycle }
            : {}),
          ...(dto.currencyCode !== undefined
            ? { currencyCode: dto.currencyCode }
            : {}),
          ...(dto.limitKey !== undefined ? { limitKey: dto.limitKey } : {}),
          ...(dto.limitValue !== undefined
            ? { limitValue: dto.limitValue }
            : {}),
          ...(dto.resetCycle !== undefined
            ? { resetCycle: dto.resetCycle }
            : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
          ...(dto.updatedBy !== undefined ? { updatedBy: dto.updatedBy } : {}),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, "Package addon");
    }
  }

  async deleteAddon(id: string) {
    await this.findAddonById(id);

    return this.prisma.packageAddon.update({
      where: { id },
      data: {
        status: PackageStatus.ARCHIVED,
        deletedAt: new Date(),
      },
    });
  }

  // ======================================================
  // SUBSCRIPTIONS
  // ======================================================

  async createSubscription(dto: CreatePackageSubscriptionDto) {
    const plan = await this.findPlanById(dto.packageId);

    if (plan.status !== PackageStatus.ACTIVE) {
      throw new BadRequestException("Only active package plans can be assigned");
    }

    const existing = await this.prisma.packageSubscription.findFirst({
      where: {
        tenantId: dto.tenantId,
        status: {
          in: [
            PackageSubscriptionStatus.TRIALING,
            PackageSubscriptionStatus.ACTIVE,
            PackageSubscriptionStatus.PAST_DUE,
          ],
        },
      },
    });

    if (existing) {
      throw new ConflictException("Tenant already has an active subscription");
    }

    const startedAt = dto.startedAt ? new Date(dto.startedAt) : new Date();

    const currentPeriodStart = dto.currentPeriodStart
      ? new Date(dto.currentPeriodStart)
      : startedAt;

    const currentPeriodEnd = dto.currentPeriodEnd
      ? new Date(dto.currentPeriodEnd)
      : this.getNextPeriodEnd(currentPeriodStart, plan.billingCycle);

    const trialEndsAt =
      plan.freeTrialDays > 0
        ? this.addDays(startedAt, plan.freeTrialDays)
        : null;

    const status =
      dto.status ??
      (trialEndsAt
        ? PackageSubscriptionStatus.TRIALING
        : PackageSubscriptionStatus.ACTIVE);

    return this.prisma.packageSubscription.create({
      data: {
        tenantId: dto.tenantId,
        packageId: plan.id,
        status,
        billingCycle: plan.billingCycle,
        price: plan.price,
        currencyCode: plan.currencyCode,
        startedAt,
        trialEndsAt,
        currentPeriodStart,
        currentPeriodEnd,
        autoRenew: dto.autoRenew ?? true,
      },
      include: {
        package: {
          include: {
            limits: true,
          },
        },
        addons: {
          include: {
            addon: true,
          },
        },
        usageCounters: true,
      },
    });
  }

  async findSubscriptions(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.packageSubscription.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          package: true,
          addons: {
            include: {
              addon: true,
            },
          },
        },
      }),
      this.prisma.packageSubscription.count(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findSubscriptionById(id: string) {
    const subscription = await this.prisma.packageSubscription.findUnique({
      where: { id },
      include: {
        package: {
          include: {
            limits: true,
          },
        },
        addons: {
          include: {
            addon: true,
          },
        },
        usageCounters: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  async findActiveSubscriptionByTenantId(tenantId: string) {
    const subscription = await this.prisma.packageSubscription.findFirst({
      where: {
        tenantId,
        status: {
          in: [
            PackageSubscriptionStatus.TRIALING,
            PackageSubscriptionStatus.ACTIVE,
            PackageSubscriptionStatus.PAST_DUE,
          ],
        },
      },
      include: {
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
        usageCounters: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException("Active subscription not found for tenant");
    }

    return subscription;
  }

  async changeSubscriptionPlan(
    subscriptionId: string,
    dto: ChangePackageSubscriptionPlanDto,
  ) {
    const subscription = await this.findSubscriptionById(subscriptionId);
    const plan = await this.findPlanById(dto.packageId);

    if (plan.status !== PackageStatus.ACTIVE) {
      throw new BadRequestException("Only active package plans can be assigned");
    }

    const effectiveDate = dto.effectiveDate
      ? new Date(dto.effectiveDate)
      : new Date();

    return this.prisma.packageSubscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        packageId: plan.id,
        billingCycle: plan.billingCycle,
        price: plan.price,
        currencyCode: plan.currencyCode,
        status: PackageSubscriptionStatus.ACTIVE,
        currentPeriodStart: effectiveDate,
        currentPeriodEnd: this.getNextPeriodEnd(
          effectiveDate,
          plan.billingCycle,
        ),
        endedAt: null,
        endReason: null,
      },
      include: {
        package: {
          include: {
            limits: true,
          },
        },
        addons: {
          include: {
            addon: true,
          },
        },
      },
    });
  }

  async cancelSubscription(
    subscriptionId: string,
    dto: CancelPackageSubscriptionDto,
  ) {
    const subscription = await this.findSubscriptionById(subscriptionId);

    const endedAt = dto.immediate
      ? new Date()
      : subscription.currentPeriodEnd;

    return this.prisma.packageSubscription.update({
      where: { id: subscription.id },
      data: {
        status: PackageSubscriptionStatus.CANCELLED,
        autoRenew: false,
        endedAt,
        endReason: dto.endReason,
      },
    });
  }

  async renewSubscription(
    subscriptionId: string,
    dto: RenewPackageSubscriptionDto,
  ) {
    const subscription = await this.findSubscriptionById(subscriptionId);

    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(subscription.currentPeriodEnd);

    return this.prisma.packageSubscription.update({
      where: { id: subscription.id },
      data: {
        status: PackageSubscriptionStatus.ACTIVE,
        currentPeriodStart: startDate,
        currentPeriodEnd: this.getNextPeriodEnd(
          startDate,
          subscription.billingCycle,
        ),
        endedAt: null,
        endReason: null,
        autoRenew: true,
      },
    });
  }

  // ======================================================
  // SUBSCRIPTION ADDONS
  // ======================================================

  async addSubscriptionAddon(
    subscriptionId: string,
    dto: CreatePackageSubscriptionAddonDto,
  ) {
    const subscription = await this.findSubscriptionById(subscriptionId);
    const addon = await this.findAddonById(dto.addonId);

    if (addon.status !== PackageStatus.ACTIVE) {
      throw new BadRequestException("Only active addons can be assigned");
    }

    const quantity = dto.quantity ?? 1;

    return this.prisma.packageSubscriptionAddon.upsert({
      where: {
        subscriptionId_addonId: {
          subscriptionId: subscription.id,
          addonId: addon.id,
        },
      },
      create: {
        subscriptionId: subscription.id,
        addonId: addon.id,
        quantity,
        status: PackageSubscriptionAddonStatus.ACTIVE,
        price: addon.price,
        currencyCode: addon.currencyCode,
      },
      update: {
        quantity,
        status: PackageSubscriptionAddonStatus.ACTIVE,
        price: addon.price,
        currencyCode: addon.currencyCode,
      },
      include: {
        addon: true,
      },
    });
  }

  async updateSubscriptionAddon(
    subscriptionAddonId: string,
    dto: UpdatePackageSubscriptionAddonDto,
  ) {
    await this.findSubscriptionAddonById(subscriptionAddonId);

    return this.prisma.packageSubscriptionAddon.update({
      where: { id: subscriptionAddonId },
      data: {
        ...(dto.quantity !== undefined ? { quantity: dto.quantity } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
      include: {
        addon: true,
      },
    });
  }

  async removeSubscriptionAddon(subscriptionAddonId: string) {
    await this.findSubscriptionAddonById(subscriptionAddonId);

    return this.prisma.packageSubscriptionAddon.update({
      where: { id: subscriptionAddonId },
      data: {
        status: PackageSubscriptionAddonStatus.CANCELLED,
      },
    });
  }

  // ======================================================
  // USAGE COUNTERS
  // ======================================================

  async getSubscriptionUsage(subscriptionId: string) {
    await this.findSubscriptionById(subscriptionId);

    return this.prisma.packageUsageCounter.findMany({
      where: { subscriptionId },
      orderBy: [{ limitKey: "asc" }, { periodStart: "desc" }],
    });
  }

  async upsertUsageCounter(
    subscriptionId: string,
    dto: UpsertPackageUsageCounterDto,
  ) {
    await this.findSubscriptionById(subscriptionId);

    return this.prisma.packageUsageCounter.upsert({
      where: {
        subscriptionId_limitKey_periodStart_periodEnd: {
          subscriptionId,
          limitKey: dto.limitKey,
          periodStart: new Date(dto.periodStart),
          periodEnd: new Date(dto.periodEnd),
        },
      },
      create: {
        subscriptionId,
        limitKey: dto.limitKey,
        usedValue: dto.usedValue,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
      },
      update: {
        usedValue: dto.usedValue,
      },
    });
  }

  async incrementUsage(
    subscriptionId: string,
    limitKey: PackageLimitKey,
    dto: IncrementPackageUsageDto,
  ) {
    await this.findSubscriptionById(subscriptionId);

    return this.prisma.packageUsageCounter.upsert({
      where: {
        subscriptionId_limitKey_periodStart_periodEnd: {
          subscriptionId,
          limitKey,
          periodStart: new Date(dto.periodStart),
          periodEnd: new Date(dto.periodEnd),
        },
      },
      create: {
        subscriptionId,
        limitKey,
        usedValue: dto.value,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
      },
      update: {
        usedValue: {
          increment: dto.value,
        },
      },
    });
  }

  async getLimitSummary(subscriptionId: string) {
    const subscription = await this.findSubscriptionById(subscriptionId);

    const summaryMap = new Map<
      PackageLimitKey,
      {
        limitKey: PackageLimitKey;
        resetCycle: PackageResetCycle;
        packageLimit: number;
        addonLimit: number;
        totalAllowed: number;
      }
    >();

    for (const planLimit of subscription.package.limits) {
      summaryMap.set(planLimit.limitKey, {
        limitKey: planLimit.limitKey,
        resetCycle: planLimit.resetCycle,
        packageLimit: planLimit.limitValue,
        addonLimit: 0,
        totalAllowed: planLimit.limitValue,
      });
    }

    const activeAddons = subscription.addons.filter(
      (item) => item.status === PackageSubscriptionAddonStatus.ACTIVE,
    );

    for (const subscriptionAddon of activeAddons) {
      const addon = subscriptionAddon.addon;
      const current = summaryMap.get(addon.limitKey);

      const addonLimitValue = addon.limitValue * subscriptionAddon.quantity;

      if (!current) {
        summaryMap.set(addon.limitKey, {
          limitKey: addon.limitKey,
          resetCycle: addon.resetCycle,
          packageLimit: 0,
          addonLimit: addonLimitValue,
          totalAllowed: addonLimitValue,
        });

        continue;
      }

      current.addonLimit += addonLimitValue;
      current.totalAllowed = current.packageLimit + current.addonLimit;
      summaryMap.set(addon.limitKey, current);
    }

    return Array.from(summaryMap.values()).sort((a, b) =>
      a.limitKey.localeCompare(b.limitKey),
    );
  }

  // ======================================================
  // PRIVATE HELPERS
  // ======================================================

  private async findPlanLimitById(id: string) {
    const limit = await this.prisma.packagePlanLimit.findUnique({
      where: { id },
    });

    if (!limit) {
      throw new NotFoundException("Package plan limit not found");
    }

    return limit;
  }

  private async findSubscriptionAddonById(id: string) {
    const subscriptionAddon =
      await this.prisma.packageSubscriptionAddon.findUnique({
        where: { id },
      });

    if (!subscriptionAddon) {
      throw new NotFoundException("Subscription addon not found");
    }

    return subscriptionAddon;
  }

  private getNextPeriodEnd(startDate: Date, cycle: PackageBillingCycle) {
    const endDate = new Date(startDate);

    if (cycle === PackageBillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
      return endDate;
    }

    if (cycle === PackageBillingCycle.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
      return endDate;
    }

    if (
      cycle === PackageBillingCycle.FREE ||
      cycle === PackageBillingCycle.ONE_TIME
    ) {
      endDate.setFullYear(endDate.getFullYear() + 100);
      return endDate;
    }

    return endDate;
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private handlePrismaError(error: unknown, entityName: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictException(`${entityName} already exists`);
      }
    }

    throw error;
  }
}