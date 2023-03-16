import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class getMeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    next();
  }
}
