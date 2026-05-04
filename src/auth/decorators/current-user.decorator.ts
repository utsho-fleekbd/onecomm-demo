import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PlatformRole, UserStatus } from "@prisma/client";

export type CurrentUserPayload = {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  status: UserStatus;

  /**
   * null means:
   * user is authenticated, but no active store has been selected yet.
   *
   * Example:
   * - after login when user has multiple stores
   * - before calling /auth/select-store
   */
  storeId: string | null;

  /**
   * null means:
   * user is the store owner, not a StoreMember,
   * or no active store has been selected yet.
   */
  storeMemberId: string | null;

  /**
   * true when the selected store belongs to this user.
   */
  isStoreOwner: boolean;

  /**
   * Store permissions resolved from StoreMemberRole → RolePermission.
   * Owner can receive ["*"].
   */
  permissions: string[];
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<{
      user: CurrentUserPayload;
    }>();

    return request.user;
  },
);
