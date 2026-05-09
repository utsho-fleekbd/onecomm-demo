import { Module } from "@nestjs/common";

import { PermissionModule } from "../permissions/permission.module";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";

@Module({
  imports: [PermissionModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
