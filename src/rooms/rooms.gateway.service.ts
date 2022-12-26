import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { getUserInfoFromSocket, joinSocketRoom } from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';
import { RoomNotFoundException } from './exceptions/room.exception';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async getRoomList(client: Socket) {
    const roomList = await this.roomRepository.find();
    return roomList;
  }

  async onCreateRoom(client: Socket, payload: CreateRoomPayload) {
    try {
      const { title } = payload;
      const userInfo: UserInfo = getUserInfoFromSocket(client);

      const createdRoom: Room = this.roomRepository.create({ host: userInfo, title });

      await joinSocketRoom(client, createdRoom.id);
    } catch (e) {
      throw e;
    }
  }

  async onJoinRoom(client: Socket, payload) {
    try {
      const { roomId } = payload;
    } catch (e) {
      throw e;
    }
  }

  async onLeaveRoom(client: Socket, payload) {
    try {
    } catch (e) {
      throw e;
    }
  }
}
