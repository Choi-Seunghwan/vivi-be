import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { createRoomInfo } from './room.utils';
import { CacheService } from 'src/cache/cache.service';
import { NAMESPACE_ROOM } from 'src/constants';
import { joinSocketRoom } from 'src/utils/socket.util';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async onCreateRoom(client: Socket, payload: CreateRoomPayload) {
    try {
      const { roomId } = payload;
      const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (!room) throw new WsException('roomId error');

      const roomInfo: RoomInfo = createRoomInfo(room);

      await this.cacheService.set(NAMESPACE_ROOM, 'room', roomInfo);
      await joinSocketRoom(client, roomId);
    } catch (e) {
      throw e;
    }
  }

  async getRoomList(client: Socket) {
    const roomList = await this.roomRepository.find();
    return roomList;
  }

  async onJoinRoom(client: Socket, payload) {}
}
