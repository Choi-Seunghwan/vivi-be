import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { gatewayOption } from 'src/common/gateway-option';
import { SendRoomChatMessage } from './dto/send-room-chat-message.payload';
import { ChatGatewayService } from './chat.gateway.service';
import { MESSAGE_CHAT } from 'src/constants/message.constant';
import { UseGuards, UsePipes } from '@nestjs/common';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { WSValidationPipe } from 'src/pipe/WsValidationPipe';

@WebSocketGateway(gatewayOption)
@UsePipes(new WSValidationPipe())
export class ChatGateway {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly chatGatewayService: ChatGatewayService) {}

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_CHAT.SEND_ROOM_CHAT_MESSAGE)
  async sendRoomChatMessage(client: Socket, payload: SendRoomChatMessage) {
    try {
      const { message, roomId } = payload;
      return await this.chatGatewayService.sendRoomChatMessage(this.server, client, { message, roomId });
    } catch (e) {
      throw new WsException(e);
    }
  }
}
