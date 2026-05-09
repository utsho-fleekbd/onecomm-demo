import { Module } from "@nestjs/common";

import { PermissionGuard } from "./guards/permission.guard";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}
