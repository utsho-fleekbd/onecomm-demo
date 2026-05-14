import { Module } from "@nestjs/common";

import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { BusinessModule } from "../business/business.module";
import { PermissionModule } from "../permissions/permission.module";
import { PackageModule } from "../packages/package.module";

@Module({
  imports: [PrismaModule, BusinessModule, PermissionModule, PackageModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
