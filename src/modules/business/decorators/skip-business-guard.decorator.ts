import { SetMetadata } from "@nestjs/common";

export const SKIP_BUSINESS_GUARD_KEY = "skip_business_guard";

export const SkipBusinessGuard = () =>
  SetMetadata(SKIP_BUSINESS_GUARD_KEY, true);
