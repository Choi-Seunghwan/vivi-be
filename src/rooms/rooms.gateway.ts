import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer } from 'socket.io';

@WebSocketGateway(null, { path: 'rooms' })
export class RoomGateway {
  @WebSocketServer()
  server: SocketIoServer;

  @SubscribeMessage('createRoom')
  createRoomHandler(client: any, payload: any): string {
    console.log('@@ here');
    return 'Hello world!';
  }

  @SubscribeMessage('joinRoom')
  joinRoomHandler(client: any, payload: any): any {
    console.log('@@ here2');
    return null;
  }
}
