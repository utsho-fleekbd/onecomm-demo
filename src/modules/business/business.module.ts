import { forwardRef, Module } from "@nestjs/common";

import { BusinessService } from "./business.service";
import { BusinessController } from "./business.controller";
import { PermissionModule } from "../permissions/permission.module";
import { BusinessGuard } from "./guards/business.guard";

@Module({
  imports: [forwardRef(() => PermissionModule)],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessGuard],
  exports: [BusinessService, BusinessGuard],
})
export class BusinessModule {}
