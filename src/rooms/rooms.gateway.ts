import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer } from 'socket.io';
import { HANDLER_ROOM } from 'src/constants';

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer()
  server: SocketIoServer;

  @SubscribeMessage(`${HANDLER_ROOM}/createRoom`)
  createRoomHandler(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage(`${HANDLER_ROOM}/joinRoom`)
  joinRoomHandler(client: any, payload: any): any {
    return null;
  }
}
