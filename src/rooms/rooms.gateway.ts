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
import { AuthService } from 'src/auth/auth.service';
import { ToeknVerifyFailed } from 'src/common/common.exception';

// @UseFilters(WsExceptionFilter)
@WebSocketGateway({ ...gatewayOption })
@UsePipes(new WSValidationPipe())
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly roomGatewayService: RoomsGatewayService, private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      if (client?.handshake?.headers?.authorization) {
        const rawToken = client?.handshake?.headers?.authorization?.split(' ')?.[1];

        if (!rawToken) return false;

        const { userInfo, token } = await this.authService.validateToken(rawToken);
        client.handshake['user'] = userInfo;
      }

      return true;
    } catch (e) {
      if (e instanceof ToeknVerifyFailed) return false;
      else throw e;
    }
  }

  async handleDisconnect(client: Socket) {
    await this.roomGatewayService.onDisconnection(this.server, client);
  }

  // @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage('ROOM/test')
  async test(client: Socket) {
    try {
      console.log('## test', client);
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.CREATE_ROOM)
  async createRoomHandler(client: Socket, payload: CreateRoomPayload) {
    try {
      return await this.roomGatewayService.onCreateRoom(this.server, client, payload);
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.JOIN_ROOM)
  async joinRoomHandler(client: Socket, payload: joinRoomPayload) {
    try {
      const result = await this.roomGatewayService.onJoinRoom(this.server, client, payload);
      return result;
    } catch (e) {
      return new WsException(e);
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_ROOM.LEAVE_ROOM)
  async leaveRoomHandler(client: Socket, payload: leaveRoomPayload) {
    try {
      const { roomId } = payload;
      return await this.roomGatewayService.onLeaveRoom(this.server, client, roomId);
    } catch (e) {
      return new WsException(e);
    }
  }
}
