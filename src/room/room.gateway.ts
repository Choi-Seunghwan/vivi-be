import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer } from 'socket.io';

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer()
  server: SocketIoServer;

  @SubscribeMessage('createRoom')
  createRoomHandler(client: any, payload: any): string {
    
    return 'Hello world!';
  }

  @SubscribeMessage('joinRoom')
  joinRoomHandler(client: any, payload: any): any {
    return null;
  }
}
