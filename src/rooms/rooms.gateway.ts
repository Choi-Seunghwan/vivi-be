import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { CreateRoomPayload } from './payload/create-room.payload';
import { RoomsGatewayService } from './rooms.gateway.service';
import { WsException } from '@nestjs/websockets';
import { joinRoomPayload } from './payload/join-room.payload';
import { leaveRoomPayload } from './payload/leave-room.payload';
import { gatewayOption } from 'src/common/gateway-option';
import { MESSAGE_ROOM } from 'src/constants/message.constant';
import { WSValidationPipe } from 'src/pipe/WsValidationPipe';
import { AuthService } from 'src/auth/auth.service';
import { ToeknVerifyFailed } from 'src/common/common.exception';
import { RoomNotFoundException } from 'src/common/room.exception';

// @UseFilters(WsExceptionFilter)
@WebSocketGateway({ ...gatewayOption })
@UsePipes(new WSValidationPipe())
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: SocketIoServer;
  logger = new Logger(RoomsGateway.name);

  constructor(private readonly roomGatewayService: RoomsGatewayService) {}

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {
    await this.roomGatewayService.onDisconnection(this.server, client);
  }

  // @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage('ROOM/test')
  async test(client: Socket) {
    try {
      throw new RoomNotFoundException();
    } catch (e) {
      this.logger.error(e);
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_ROOM.CREATE_ROOM)
  async createRoomHandler(client: Socket, payload: CreateRoomPayload) {
    try {
      const roomInfo = await this.roomGatewayService.onCreateRoom(this.server, client, payload);
      return roomInfo;
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_ROOM.JOIN_ROOM)
  async joinRoomHandler(client: Socket, payload: joinRoomPayload) {
    try {
      const result = await this.roomGatewayService.onJoinRoom(this.server, client, payload);
      return result;
    } catch (e) {
      this.logger.error(e);
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_ROOM.LEAVE_ROOM)
  async leaveRoomHandler(client: Socket, payload: leaveRoomPayload) {
    try {
      const { roomId } = payload;
      return await this.roomGatewayService.onLeaveRoom(this.server, client, roomId);
    } catch (e) {
      return new WsException(e);
    }
  }
}
