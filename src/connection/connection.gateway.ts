import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { HANDLER_CONNECTION } from 'src/constants/message.constant';
import { Server as SocketIoServer, Socket } from 'socket.io';

@WebSocketGateway()
export class ConnectionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: SocketIoServer;

  handleConnection(client) {
    // hook
  }

  @SubscribeMessage(`${HANDLER_CONNECTION}/message`)
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
