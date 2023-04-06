import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserInfo } from 'src/types/auth';

export const AuthUserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): UserInfo => {
  const req = ctx.switchToHttp().getRequest();
  const userInfo: UserInfo = req.user;

  return userInfo;
});

/*
export const SocketAuthUserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): UserInfo => {
  const client = ctx.switchToWs().getClient();
  const userInfo: UserInfo = client?.handshake?.user;

  return userInfo;
});
*/
