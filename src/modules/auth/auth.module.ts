import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { BusinessModule } from "../business/business.module";
import { PackageModule } from "../packages/package.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    MailModule,
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    BusinessModule,
    PackageModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>("JWT_ACCESS_SECRET");

        const expiresIn = configService.get<string>("JWT_ACCESS_EXPIRES_IN");

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as JwtSignOptions["expiresIn"],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
