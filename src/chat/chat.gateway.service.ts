import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { SendRoomChatMessage } from './dto/send-room-chat-message.payload';

@Injectable()
export class ChatGatewayService {
  constructor(@InjectRepository(ChatMessage) private chatMessageRepository: Repository<ChatMessage>) {}

  async sendRoomChatMessage(client: Socket, payload: SendRoomChatMessage) {
    try {
    } catch (e) {}
  }
}
