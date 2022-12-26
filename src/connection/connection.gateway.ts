import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { HANDLER_CONNECTION } from 'src/constants';

@WebSocketGateway()
export class ConnectionGateway implements OnGatewayConnection {
  handleConnection(client) {
    // hook
    console.log('@@ here');
  }

  @SubscribeMessage(`${HANDLER_CONNECTION}/message`)
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
