import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { CreateRoomPayload } from './payload/create-room.payload';
import { RoomsGatewayService } from './rooms.gateway.service';
import { WsException } from '@nestjs/websockets';
import { joinRoomPayload } from './payload/join-room.payload';
import { leaveRoomPayload } from './payload/leave-room.payload';
import { gatewayOption } from 'src/common/gateway-option';
import { HANDLER_ROOM } from 'src/constants/message.constant';
import { WSValidationPipe } from 'src/pipe/WsValidationPipe';
import { getUserInfoFromSocket } from 'src/utils/socket.util';

// @UseFilters(WsExceptionFilter)
@WebSocketGateway({ ...gatewayOption })
@UsePipes(new WSValidationPipe())
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly roomGatewayService: RoomsGatewayService) {}

  handleConnection(client: Socket) {
    // console.log('@@ roomGAteway : ', client.id);
  }

  handleDisconnect(client: Socket) {
    //
    const userInfo: UserInfo = getUserInfoFromSocket(client);
    const rooms = client.rooms;
  }

  @SubscribeMessage('ROOM/test')
  async test(client: Socket, @MessageBody() payload: CreateRoomPayload) {
    try {
      console.log('## test', payload);
      // return 'test';
      throw new Error('ee');
    } catch (e) {
      return new WsException(e);
    }
  }

  @SubscribeMessage(HANDLER_ROOM.LIST)
  async getRoomList(client: Socket) {
    try {
      const roomList = await this.roomGatewayService.getRoomList(client);
      return roomList;
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.CREATE_ROOM)
  async createRoomHandler(client: Socket, payload: CreateRoomPayload) {
    try {
      return await this.roomGatewayService.onCreateRoom(client, payload);
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.JOIN_ROOM)
  async joinRoomHandler(client: Socket, payload: joinRoomPayload) {
    try {
      const result = await this.roomGatewayService.onJoinRoom(client, payload);
      return result;
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.LEAVE_ROOM)
  async leaveRoomHandler(client: Socket, payload: leaveRoomPayload) {
    try {
      return await this.roomGatewayService.onLeaveRoom(this.server, client, payload);
    } catch (e) {
      return new WsException(e);
    }
  }
}
