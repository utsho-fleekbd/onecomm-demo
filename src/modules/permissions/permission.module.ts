import { Module } from "@nestjs/common";

import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionGuard } from "./guards/permission.guard";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";

@Module({
  imports: [PrismaModule],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionsModule {}
