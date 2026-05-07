import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { BusinessService } from "./business.service";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { QueryBusinessDto } from "./dto/query-business.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/decorators/current-user.decorator";

@ApiTags("Business")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: "Create business" })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateBusinessDto,
  ) {
    return this.businessService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all businesses" })
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryBusinessDto,
  ) {
    return this.businessService.findAll(user.id, query);
  }

  @Get(":businessId")
  @ApiOperation({ summary: "Get business details" })
  @ApiParam({ name: "businessId", example: "business-uuid" })
  findOne(@Param("businessId") businessId: string) {
    return this.businessService.findOne(+businessId);
  }

  @Patch(":businessId")
  @ApiOperation({ summary: "Update business" })
  @ApiParam({ name: "businessId", example: "business-uuid" })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("businessId") businessId: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessService.update(user.id, +businessId, dto);
  }

  @Delete(":businessId")
  @ApiOperation({ summary: "Delete business" })
  @ApiParam({ name: "businessId", example: "business-uuid" })
  remove(@Param("businessId") businessId: string) {
    return this.businessService.remove(+businessId);
  }
}
