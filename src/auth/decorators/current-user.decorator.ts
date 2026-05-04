import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PlatformRole } from "@prisma/client";

export type CurrentUserPayload = {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  status: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
