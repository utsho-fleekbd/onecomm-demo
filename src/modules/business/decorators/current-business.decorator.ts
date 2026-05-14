import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { BusinessAccessContext } from "../../../common/request-context/request-context.types";
import type { AuthenticatedRequest } from "../../auth/strategies/jwt.strategy";

export const CurrentBusiness = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): BusinessAccessContext | null => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.businessContext ?? null;
  },
);
