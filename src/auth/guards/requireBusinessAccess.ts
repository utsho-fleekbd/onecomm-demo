import { AuthenticatedRequest } from "../strategies/jwt.strategy";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class RequireBusinessAccess implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!user.businessId) {
      throw new ForbiddenException("Only admin can access this resource");
    }

    return true;
  }
}
