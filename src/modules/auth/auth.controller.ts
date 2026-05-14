import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { LogoutDto } from "./dto/logout.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SelectBusinessDto } from "./dto/select-business.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { CurrentUserPayload } from "./decorators/current-user.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyRegisterDto } from "./dto/verify-register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { VerifyResetOtpDto } from "./dto/verify-reset-otp.dto";
import { ResetForgotPasswordDto } from "./dto/reset-forgot-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register admin and create first business" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("register/verify")
  verifyRegister(@Body() dto: VerifyRegisterDto) {
    return this.authService.verifyRegister(dto);
  }

  @Get("check-email")
  @ApiOperation({ summary: "Email Validation" })
  checkEmail(@Query("email") email: string) {
    return this.authService.checkEmail(email);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Send otp for forget password" })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post("forgot-password/verify-otp")
  @ApiOperation({ summary: "Verify for forget password" })
  verifyResetOtp(@Body() dto: VerifyResetOtpDto) {
    return this.authService.verifyResetOtp(dto);
  }

  @Post("forgot-password/reset")
  @ApiOperation({ summary: "Reset forget password" })
  resetForgotPassword(@Body() dto: ResetForgotPasswordDto) {
    return this.authService.resetForgotPassword(dto);
  }

  @Post("reset")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Password reset" })
  resetPassword(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, dto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh the current access token" })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post("select-business")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Select active business after login" })
  selectBusiness(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: SelectBusinessDto,
  ) {
    return this.authService.selectBusiness(user.id, dto);
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get authenticated user profile" })
  me(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.me(user);
  }

  @Patch("profile/update")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get authenticated user profile" })
  updateUser(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updateUser(user.id, dto);
  }

  @Post("logout")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Logout current session" })
  logout(@CurrentUser() user: CurrentUserPayload, @Body() dto: LogoutDto) {
    return this.authService.logout(dto, user.id);
  }

  @Post("logout-all")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Logout from all sessions" })
  logoutAll(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.logoutAll(user.id);
  }
}
