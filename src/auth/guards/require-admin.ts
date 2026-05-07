import { AuthenticatedRequest } from "../strategies/jwt.strategy";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { SystemUserType } from "@prisma/client";

@Injectable()
export class RequireAdmin implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (user.type !== SystemUserType.ADMIN) {
      throw new ForbiddenException("Only admin can access this resource");
    }

    return true;
  }
}
