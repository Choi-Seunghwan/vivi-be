import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class webSocketJwtAuthGuard extends AuthGuard('webSocketJwt') {
  constructor() {
    super();
  }

  getRequest(ctx: ExecutionContext) {
    return ctx.switchToWs().getClient().handshake;
  }
}
