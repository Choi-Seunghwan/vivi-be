import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { getUserInfoFromSocket, sendChatMessageToRoom } from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ChatGatewayService {
  constructor(@InjectRepository(ChatMessage) private chatMessageRepository: Repository<ChatMessage>, private cacheService: CacheService) {}

  async sendRoomChatMessage(server: SocketIoServer, client: Socket, { message, roomId }) {
    try {
      const userInfo: UserInfo = getUserInfoFromSocket(client);
      const chatMessage: ChatMessage = this.chatMessageRepository.create({ user: userInfo, message, room: { id: roomId } });

      await this.chatMessageRepository.save(chatMessage);

      sendChatMessageToRoom(server, roomId, chatMessage);
    } catch (e) {
      throw e;
    }
  }
}
