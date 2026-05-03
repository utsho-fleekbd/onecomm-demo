import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

const JWT_DEFAULT_EXPIRES_IN = "1d";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>("JWT_ACCESS_SECRET");

        const expiresIn =
          configService.get<string>("JWT_ACCESS_EXPIRES_IN") ??
          JWT_DEFAULT_EXPIRES_IN;

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
