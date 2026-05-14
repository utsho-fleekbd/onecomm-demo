import { Module } from "@nestjs/common";

import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { BusinessModule } from "../business/business.module";
import { PermissionModule } from "../permissions/permission.module";
import { PackageModule } from "../packages/package.module";

@Module({
  imports: [PermissionModule, BusinessModule, PackageModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
