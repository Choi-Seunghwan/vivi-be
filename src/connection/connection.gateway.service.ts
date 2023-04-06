import { Injectable, Logger } from '@nestjs/common';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { getUserInfoFromSocket, sendAnswer as _sendAnswer, sendOffer as _sendOffer } from 'src/utils/socket.util';
import { UserInfo } from 'src/types/auth';
import { roomMemberFactory } from 'src/rooms/room.utils';

@Injectable()
export class ConnectionGatewayService {
  logger = new Logger(ConnectionGatewayService.name);

  constructor() {}

  async onDisconnection(server: SocketIoServer, client: Socket) {}

  async sendOffer(client: Socket, { offer, destSocketId }: { offer: object; destSocketId: string }) {
    try {
      const userInfo: UserInfo = getUserInfoFromSocket(client);
      const member = roomMemberFactory(userInfo);

      _sendOffer(client, { offer, socketId: destSocketId, member });
    } catch (e) {
      throw e;
    }
  }

  async sendAnswer(client: Socket, { answer, destSocketId }: { answer: object; destSocketId: string }) {
    try {
      const userInfo: UserInfo = getUserInfoFromSocket(client);
      const member = roomMemberFactory(userInfo);

      _sendAnswer(client, { answer, socketId: destSocketId, member });
    } catch (e) {
      throw e;
    }
  }
}
