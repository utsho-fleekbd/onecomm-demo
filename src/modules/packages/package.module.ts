import { forwardRef, Module } from "@nestjs/common";

import { AdminPackageService } from "./admin/admin-package.service";
import { AdminPackageController } from "./admin/admin-package.controller";
import { PackageLimitGuard } from "./guards/package-limit.guard";
import { PackageLimitService } from "./package-limit.service";
import { PackageSubscriptionService } from "./package-subscription.service";
import { SubscriptionGuard } from "./guards/subscription.guard";
import { TenantPackageController } from "./tenant/tenant-package.controller";
import { TenantPackageService } from "./tenant/tenant-package.service";
import { PermissionModule } from "../permissions/permission.module";

@Module({
  imports: [forwardRef(() => PermissionModule)],
  controllers: [AdminPackageController, TenantPackageController],
  providers: [
    AdminPackageService,
    TenantPackageService,
    PackageSubscriptionService,
    PackageLimitService,
    SubscriptionGuard,
    PackageLimitGuard,
  ],
  exports: [
    PackageSubscriptionService,
    PackageLimitService,
    SubscriptionGuard,
    PackageLimitGuard,
  ],
})
export class PackageModule {}
