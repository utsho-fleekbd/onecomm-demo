import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SystemUserStatus, SystemUserType } from "@prisma/client";

export type CurrentUserPayload = {
  id: number;
  name: string;
  email: string;
  type: SystemUserType;
  status: SystemUserStatus;
  businessId: number | null;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<{
      user: CurrentUserPayload;
    }>();

    return request.user;
  },
);
