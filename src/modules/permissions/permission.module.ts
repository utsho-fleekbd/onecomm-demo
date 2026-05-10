import { forwardRef, Module } from "@nestjs/common";

import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { PermissionGuard } from "./guards/permission.guard";
import { BusinessModule } from "../business/business.module";

@Module({
  imports: [forwardRef(() => BusinessModule)],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}
