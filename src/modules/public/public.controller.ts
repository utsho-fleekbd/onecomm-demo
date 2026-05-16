import { ApiOperation } from "@nestjs/swagger";
import { Controller, Get, Query } from "@nestjs/common";

import { PublicService } from "./public.service";
import { QueryPackageDto } from "./dto/query-package.dto";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiOperation({ summary: "Get available packages" })
  @Get()
  async getPackages(@Query() query: QueryPackageDto) {
    return this.publicService.getPackages(query);
  }
}
