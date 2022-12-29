import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { gatewayOption } from 'src/common/gateway-option';
import { SendRoomChatMessage } from './dto/send-room-chat-message.payload';
import { ChatGatewayService } from './chat.gateway.service';
import { HANDLER_CHAT } from 'src/constants/event-handler.constant';

@WebSocketGateway(gatewayOption)
export class ChatGateway {
  @WebSocketServer()
  server: SocketIoServer;

  constructor(private readonly chatGatewayService: ChatGatewayService) {}

  @SubscribeMessage(HANDLER_CHAT.SEND_ROOM_CHAT_MESSAGE)
  async sendRoomChatMessage(client: Socket, payload: SendRoomChatMessage) {
    try {
      return await this.chatGatewayService.sendRoomChatMessage(client, payload);
    } catch (e) {
      throw new WsException(e);
    }
  }
}
