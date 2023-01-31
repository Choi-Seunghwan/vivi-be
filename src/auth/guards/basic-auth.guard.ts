import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthGuard extends NestAuthGuard('basic') {
  logger = new Logger(BasicAuthGuard.name);

  canActivate(context: ExecutionContext): any {
    return super.canActivate(context);
  }
}
