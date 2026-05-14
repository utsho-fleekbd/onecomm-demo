import { Module } from "@nestjs/common";

import { PrismaModule } from "../../prisma/prisma.module";
import { AdminPackageService } from "./admin-package.service";
import { AdminPackageController } from "./admin-package.controller";

@Module({
  imports: [PrismaModule],
  controllers: [AdminPackageController],
  providers: [AdminPackageService],
  exports: [AdminPackageService],
})
export class AdminPackageModule {}
