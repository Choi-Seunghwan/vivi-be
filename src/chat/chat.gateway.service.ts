import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { SendRoomChatMessage } from './dto/send-room-chat-message.payload';
import { getUserInfoFromSocket } from 'src/utils/socket.util';
import { v4 as uuid } from 'uuid';
import { CacheService } from 'src/cache/cache.service';
import { RoomInfo } from 'src/rooms/room.info';

@Injectable()
export class ChatGatewayService {
  constructor(@InjectRepository(ChatMessage) private chatMessageRepository: Repository<ChatMessage>, private cacheService: CacheService) {}

  async sendRoomChatMessage(client: Socket, payload: SendRoomChatMessage) {
    try {
      const userInfo: UserInfo = getUserInfoFromSocket(client);
      const { message, roomId } = payload;

      const roomInfo: RoomInfo = await this.cacheService.getRoomInfo(roomId);

      const chatMessage: ChatMessage = this.chatMessageRepository.create({ user: userInfo, message, room: { id: roomId } });
      await this.chatMessageRepository.save(chatMessage);
    } catch (e) {
      throw e;
    }
  }
}
