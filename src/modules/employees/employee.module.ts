import { Module } from "@nestjs/common";

import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { BusinessModule } from "../business/business.module";
import { PermissionModule } from "../permissions/permission.module";

@Module({
  imports: [PermissionModule, BusinessModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
