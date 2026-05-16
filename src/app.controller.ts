import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@ApiTags("Test")
@Controller("ping")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Test the server." })
  @Get()
  ping() {
    return this.appService.ping();
  }
}
