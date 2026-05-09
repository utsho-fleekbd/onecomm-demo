import { Module } from "@nestjs/common";

import { BusinessService } from "./business.service";
import { BusinessController } from "./business.controller";
import { PermissionModule } from "../permissions/permission.module";

@Module({
  imports: [PermissionModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
