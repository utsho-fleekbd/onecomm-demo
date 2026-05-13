import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AdminPackageController } from "./admin_package.controller";
import { AdminPackageService } from "./admin_package.service";

@Module({
  imports: [PrismaModule],
  controllers: [AdminPackageController],
  providers: [AdminPackageService],
  exports: [AdminPackageService],
})
export class AdminPackageModule {}