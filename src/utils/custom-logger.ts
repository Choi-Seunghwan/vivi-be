import { ConsoleLogger } from '@nestjs/common';
import { Exception } from 'src/common/exception';

export class CustomLogger extends ConsoleLogger {
  /** override. 추후에 로그 수집 외부 서비스 연동할 것 */
  /*
  const sendError = () => {
    send sentry...
  }

  */
  error(error: Exception | Error) {
    const { message, stack } = error;
    const args: Object = error['args'];
    const context = args ? JSON.stringify(args) : null;
    super.error(message, stack, context);
  }

  debug(error: Error) {
    const { message, stack } = error;
    super.debug(message, stack);
  }
}
