import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class webSocketJwtAuthGuard extends AuthGuard('webSocketJwt') {
  constructor() {
    super();
  }

  getRequest(ctx: ExecutionContext) {
    const a = ctx.switchToWs();
    const b = a.getClient();
    const c = b.handshake;
    return ctx.switchToWs().getClient().handshake;
  }
}
