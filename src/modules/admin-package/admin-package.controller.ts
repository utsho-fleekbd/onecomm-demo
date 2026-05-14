import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { AdminPackageService } from "./admin-package.service";
import {
  CancelPackageSubscriptionDto,
  ChangePackageSubscriptionPlanDto,
  CreatePackageAddonDto,
  CreatePackagePlanDto,
  CreatePackagePlanLimitDto,
  CreatePackageSubscriptionAddonDto,
  CreatePackageSubscriptionDto,
  PaginationQueryDto,
  RenewPackageSubscriptionDto,
  UpdatePackageAddonDto,
  UpdatePackagePlanDto,
  UpdatePackagePlanLimitDto,
  UpdatePackageSubscriptionAddonDto,
} from "./dto/admin-package.dto";

@ApiTags("AdminPackage")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("admin/package")
export class AdminPackageController {
  constructor(private readonly adminPackageService: AdminPackageService) {}

  @Post("plans")
  createPlan(@Body() dto: CreatePackagePlanDto) {
    return this.adminPackageService.createPlan(dto);
  }

  @Get("plans")
  findPlans(@Query() query: PaginationQueryDto) {
    return this.adminPackageService.findPlans(query);
  }

  @Get("plans/:id")
  findPlanById(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminPackageService.findPlanById(id);
  }

  @Patch("plans/:id")
  updatePlan(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdatePackagePlanDto,
  ) {
    return this.adminPackageService.updatePlan(id, dto);
  }

  @Delete("plans/:id")
  deletePlan(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminPackageService.deletePlan(id);
  }

  // ======================================================
  // PACKAGE PLAN LIMITS
  // ======================================================

  @Post("plans/:packageId/limits")
  createPlanLimit(
    @Param("packageId", ParseUUIDPipe) packageId: string,
    @Body() dto: CreatePackagePlanLimitDto,
  ) {
    return this.adminPackageService.createPlanLimit(packageId, dto);
  }

  @Get("plans/:packageId/limits")
  findPlanLimits(@Param("packageId", ParseUUIDPipe) packageId: string) {
    return this.adminPackageService.findPlanLimits(packageId);
  }

  @Patch("plan-limits/:limitId")
  updatePlanLimit(
    @Param("limitId", ParseUUIDPipe) limitId: string,
    @Body() dto: UpdatePackagePlanLimitDto,
  ) {
    return this.adminPackageService.updatePlanLimit(limitId, dto);
  }

  @Delete("plan-limits/:limitId")
  deletePlanLimit(@Param("limitId", ParseUUIDPipe) limitId: string) {
    return this.adminPackageService.deletePlanLimit(limitId);
  }

  // ======================================================
  // ADDONS
  // ======================================================

  @Post("addons")
  createAddon(@Body() dto: CreatePackageAddonDto) {
    return this.adminPackageService.createAddon(dto);
  }

  @Get("addons")
  findAddons(@Query() query: PaginationQueryDto) {
    return this.adminPackageService.findAddons(query);
  }

  @Get("addons/:id")
  findAddonById(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminPackageService.findAddonById(id);
  }

  @Patch("addons/:id")
  updateAddon(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdatePackageAddonDto,
  ) {
    return this.adminPackageService.updateAddon(id, dto);
  }

  @Delete("addons/:id")
  deleteAddon(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminPackageService.deleteAddon(id);
  }

  // ======================================================
  // SUBSCRIPTIONS
  // ======================================================

  @Post("subscriptions")
  createSubscription(@Body() dto: CreatePackageSubscriptionDto) {
    return this.adminPackageService.createSubscription(dto);
  }

  @Get("subscriptions")
  findSubscriptions(@Query() query: PaginationQueryDto) {
    return this.adminPackageService.findSubscriptions(query);
  }

  @Get("subscriptions/tenant/:tenantId/active")
  findActiveSubscriptionByTenantId(
    @Param("tenantId", ParseUUIDPipe) tenantId: string,
  ) {
    return this.adminPackageService.findActiveSubscriptionByTenantId(tenantId);
  }

  @Get("subscriptions/:id")
  findSubscriptionById(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminPackageService.findSubscriptionById(id);
  }

  @Post("subscriptions/:id/change-plan")
  changeSubscriptionPlan(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ChangePackageSubscriptionPlanDto,
  ) {
    return this.adminPackageService.changeSubscriptionPlan(id, dto);
  }

  @Post("subscriptions/:id/cancel")
  cancelSubscription(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CancelPackageSubscriptionDto,
  ) {
    return this.adminPackageService.cancelSubscription(id, dto);
  }

  @Post("subscriptions/:id/renew")
  renewSubscription(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: RenewPackageSubscriptionDto,
  ) {
    return this.adminPackageService.renewSubscription(id, dto);
  }

  // ======================================================
  // SUBSCRIPTION ADDONS
  // ======================================================

  @Post("subscriptions/:subscriptionId/addons")
  addSubscriptionAddon(
    @Param("subscriptionId", ParseUUIDPipe) subscriptionId: string,
    @Body() dto: CreatePackageSubscriptionAddonDto,
  ) {
    return this.adminPackageService.addSubscriptionAddon(subscriptionId, dto);
  }

  @Patch("subscription-addons/:subscriptionAddonId")
  updateSubscriptionAddon(
    @Param("subscriptionAddonId", ParseUUIDPipe) subscriptionAddonId: string,
    @Body() dto: UpdatePackageSubscriptionAddonDto,
  ) {
    return this.adminPackageService.updateSubscriptionAddon(
      subscriptionAddonId,
      dto,
    );
  }

  @Delete("subscription-addons/:subscriptionAddonId")
  removeSubscriptionAddon(
    @Param("subscriptionAddonId", ParseUUIDPipe) subscriptionAddonId: string,
  ) {
    return this.adminPackageService.removeSubscriptionAddon(
      subscriptionAddonId,
    );
  }

  // ======================================================
  // USAGE COUNTERS
  // ======================================================

  @Get("subscriptions/:subscriptionId/usage")
  getSubscriptionUsage(
    @Param("subscriptionId", ParseUUIDPipe) subscriptionId: string,
  ) {
    return this.adminPackageService.getSubscriptionUsage(subscriptionId);
  }

  // @Post("subscriptions/:subscriptionId/usage")
  // upsertUsageCounter(
  //   @Param("subscriptionId", ParseUUIDPipe) subscriptionId: string,
  //   @Body() dto: UpsertPackageUsageCounterDto,
  // ) {
  //   return this.adminPackageService.upsertUsageCounter(subscriptionId, dto);
  // }

  // @Post("subscriptions/:subscriptionId/usage/:limitKey/increment")
  // incrementUsage(
  //   @Param("subscriptionId", ParseUUIDPipe) subscriptionId: string,
  //   @Param("limitKey", new ParseEnumPipe(PackageLimitKey))
  //   limitKey: PackageLimitKey,
  //   @Body() dto: IncrementPackageUsageDto,
  // ) {
  //   return this.adminPackageService.incrementUsage(
  //     subscriptionId,
  //     limitKey,
  //     dto,
  //   );
  // }

  @Get("subscriptions/:subscriptionId/limit-summary")
  getLimitSummary(
    @Param("subscriptionId", ParseUUIDPipe) subscriptionId: string,
  ) {
    return this.adminPackageService.getLimitSummary(subscriptionId);
  }
}
