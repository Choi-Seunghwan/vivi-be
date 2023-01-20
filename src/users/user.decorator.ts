import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): UserInfo => {
  const req = ctx.switchToHttp().getRequest();
  const userInfo: UserInfo = req.user;

  return userInfo;
});
