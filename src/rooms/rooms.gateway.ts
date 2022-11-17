import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { HANDLER_ROOM } from 'src/constants';
import { CreateRoomPayload } from './payload/create-room.payload';
import { RoomsGatewayService } from './rooms.gateway.service';

@WebSocketGateway({
  namespace: 'rooms',
})
export class RoomsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly roomGatewayService: RoomsGatewayService) {}

  handleConnection(client: Socket) {
    console.log('connection : ', client.id);
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(`${HANDLER_ROOM}/list`)
  async getRoomList(client: Socket) {
    const roomList = await this.roomGatewayService.getRoomList(client);
    return roomList;
  }

  @SubscribeMessage(`${HANDLER_ROOM}/createRoom`)
  async createRoomHandler(client: Socket, payload: CreateRoomPayload) {
    await this.roomGatewayService.onCreateRoom(client, payload);
  }

  @SubscribeMessage(`${HANDLER_ROOM}/joinRoom`)
  joinRoomHandler(client: Socket, payload: any): any {
    return null;
  }
}
