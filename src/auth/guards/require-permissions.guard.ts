import { CanActivate, Injectable } from "@nestjs/common";

@Injectable()
export class RequirePermissions implements CanActivate {
  async canActivate(): Promise<boolean> {
    return true;
  }
}
