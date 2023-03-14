import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesAuthGuard extends NestAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): any {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) throw new UnauthorizedException();

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) throw new UnauthorizedException();
    if (!user?.roles?.some((role) => requiredRoles.includes(String(role).toUpperCase()))) throw new UnauthorizedException();

    return user;
  }
}
