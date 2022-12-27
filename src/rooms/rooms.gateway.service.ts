import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getUserInfoFromSocket, joinSocketRoom } from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';
import { AlreadyJoinedRoomException, RoomCreateFailException, RoomNotFoundException } from './exceptions/room.exception';
import { roomInfoFactory } from './room.utils';
import { NAMESPACE_ROOM } from 'src/constants';
import { joinRoomPayload } from './payload/join-room.payload';
import { leaveRoomPayload } from './payload/leave-room.payload';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async getRoomList(client: Socket) {
    const roomList = await this.roomRepository.find();
    return roomList;
  }

  async onCreateRoom(client: Socket, payload: CreateRoomPayload): Promise<any> {
    try {
      const { title } = payload;
      const userInfo: UserInfo = getUserInfoFromSocket(client);

      const createdRoom: Room = this.roomRepository.create({ host: userInfo, title });

      if (!createdRoom) throw new RoomCreateFailException();

      const roomInfo: RoomInfo = roomInfoFactory(createdRoom, userInfo);

      await this.cacheService.set(NAMESPACE_ROOM, createdRoom.id, roomInfo);

      await joinSocketRoom(client, createdRoom.id);

      return true;
    } catch (e) {
      throw e;
    }
  }

  async onJoinRoom(client: Socket, payload: joinRoomPayload): Promise<any> {
    try {
      const { roomId } = payload;
      // const userInfo: UserInfo = getUserInfoFromSocket(client);
      // const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });

      const roomInfo: RoomInfo;

      if (!room) throw new RoomNotFoundException();

      await joinSocketRoom(client, room.id);

      if (true) throw new AlreadyJoinedRoomException();
      return true;
    } catch (e) {
      throw e;
    }
  }

  async onLeaveRoom(client: Socket, payload: leaveRoomPayload): Promise<any> {
    try {
      const { roomId } = payload;
      const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });
    } catch (e) {
      throw e;
    }
  }
}
