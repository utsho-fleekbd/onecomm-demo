import { ConfigModule } from "@nestjs/config";
import { MiddlewareConsumer, Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BusinessModule } from "./modules/business/business.module";
import { RequestLoggerMiddleware } from "./common/middlewares/request-logger.middleware";
import { AdminPackageModule } from './modules/admin_package/admin_package.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BusinessModule,
    AdminPackageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
