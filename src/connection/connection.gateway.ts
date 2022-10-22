import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(null, { path: 'connection' })
export class ConnectionGateway {
  @SubscribeMessage('connection/message')
  handleMessage(client: any, payload: any): string {
    console.log('@@ here3');
    return 'Hello world!';
  }
}
