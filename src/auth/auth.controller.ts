import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { CurrentUserPayload } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SelectStoreDto } from "./dto/select-store.dto";
import { SuperAdminGuard } from "./guards/super-admin.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register admin and create first store" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("select-store")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Select active store after login" })
  selectStore(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: SelectStoreDto,
  ) {
    return this.authService.selectStore(user.id, dto.storeId);
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get authenticated user profile" })
  me(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.me(user.id, user.storeId);
  }

  @Get("admins")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @ApiOperation({ summary: "Get all the platform admin" })
  getAdmins() {
    return this.authService.getAdmins();
  }
}
