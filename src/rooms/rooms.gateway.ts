import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { CreateRoomPayload } from './payload/create-room.payload';
import { RoomsGatewayService } from './rooms.gateway.service';
import { WsException } from '@nestjs/websockets';
import { joinRoomPayload } from './payload/join-room.payload';
import { leaveRoomPayload } from './payload/leave-room.payload';
import { gatewayOption } from 'src/common/gateway-option';
import { HANDLER_ROOM } from 'src/constants/event-handler.constant';

@WebSocketGateway(gatewayOption)
export class RoomsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly roomGatewayService: RoomsGatewayService) {}

  handleConnection(client: Socket) {
    console.log('@@ roomGAteway : ', client.id);
  }

  @SubscribeMessage(`${HANDLER_ROOM}/test`)
  async test(client: Socket) {
    try {
      console.log('## test');
    } catch (e) {
      throw new WsException(e);
    }
  }

  @SubscribeMessage(HANDLER_ROOM.LIST)
  async getRoomList(client: Socket) {
    try {
      const roomList = await this.roomGatewayService.getRoomList(client);
      return roomList;
    } catch (e) {
      throw new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.CREATE_ROOM)
  async createRoomHandler(client: Socket, payload: CreateRoomPayload) {
    try {
      return await this.roomGatewayService.onCreateRoom(client, payload);
    } catch (e) {
      throw new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.JOIN_ROOM)
  async joinRoomHandler(client: Socket, payload: joinRoomPayload) {
    try {
      return await this.roomGatewayService.onJoinRoom(client, payload);
    } catch (e) {
      throw new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.LEAVE_ROOM)
  async leaveRoomHandler(client: Socket, payload: leaveRoomPayload) {
    try {
      return await this.roomGatewayService.onLeaveRoom(client, payload);
    } catch (e) {
      throw new WsException(e);
    }
  }
}
