import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { gatewayOption } from 'src/common/gateway-option';
import { SendRoomChatMessage } from './dto/send-room-chat-message.payload';
import { ChatGatewayService } from './chat.gateway.service';
import { HANDLER_CHAT } from 'src/constants/event-handler.constant';
import { UseGuards } from '@nestjs/common';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';

@WebSocketGateway(gatewayOption)
export class ChatGateway {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly chatGatewayService: ChatGatewayService) {}

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(HANDLER_CHAT.SEND_ROOM_CHAT_MESSAGE)
  async sendRoomChatMessage(client: Socket, payload: SendRoomChatMessage) {
    try {
      return await this.chatGatewayService.sendRoomChatMessage(client, payload);
    } catch (e) {
      throw new WsException(e);
    }
  }
}
