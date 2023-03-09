import { ConsoleLogger } from '@nestjs/common';
import { Exception } from 'src/common/exception';

export class CustomLogger extends ConsoleLogger {
  /** override. 추후에 로그 수집 외부 서비스 연동할 것 */
  /*
  const sendError = () => {
    send sentry...
  }

  */

  debug(message: string, trace: string) {
    super.debug(message, trace);
  }

  error(error: Exception | Error, args: any) {
    const { message, stack } = error;
    const context = args ? JSON.stringify(args) : null;
    super.error(message, stack, context);
  }
}
