import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type CurrentUserPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
