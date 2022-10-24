import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { HANDLER_CONNECTION } from 'src/constants';

@WebSocketGateway()
export class ConnectionGateway {
  @SubscribeMessage(`${HANDLER_CONNECTION}/message`)
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
