import { Injectable } from '@nestjs/common';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getUserInfoFromSocket,
  joinSocketRoom,
  leaveSocketRoom,
  sendMessageNewRoomMemberJoined,
  sendMessageRoomMemberLeaved,
} from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';
import { AlreadyJoinedRoomException, RoomCreateFailException, RoomNotFoundException } from './exceptions/room.exception';
import { roomInfoFactory, roomMemberFactory } from './room.utils';
import { joinRoomPayload } from './payload/join-room.payload';
import { leaveRoomPayload } from './payload/leave-room.payload';
import { RoomInfo } from './room.info';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async getRoomList(client: Socket) {
    const roomList = await this.roomRepository.find();
    return roomList;
  }

  async onCreateRoom(client: Socket, payload: CreateRoomPayload): Promise<Room> {
    try {
      const { title } = payload;
      const userInfo: UserInfo = getUserInfoFromSocket(client);

      const createdRoom: Room = this.roomRepository.create({ host: userInfo, title });
      await this.roomRepository.save(createdRoom);

      if (!createdRoom) throw new RoomCreateFailException();

      const roomInfo: RoomInfo = roomInfoFactory(createdRoom, userInfo);

      await this.cacheService.setRoomInfo(createdRoom.id, roomInfo);

      await joinSocketRoom(client, createdRoom.id);

      return createdRoom;
    } catch (e) {
      throw e;
    }
  }

  async onJoinRoom(client: Socket, payload: joinRoomPayload): Promise<RoomInfo> {
    try {
      const { roomId } = payload;
      const roomInfo: RoomInfo = await this.cacheService.getRoomInfo(roomId);
      const newRoomMember: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));

      await joinSocketRoom(client, roomId);

      roomInfo.members.set(roomId, newRoomMember);
      await this.cacheService.setRoomInfo(roomId, roomInfo);

      await sendMessageNewRoomMemberJoined(client, newRoomMember, roomId);

      return roomInfo;
    } catch (e) {
      throw e;
    }
  }

  async onLeaveRoom(server: SocketIoServer, client: Socket, payload: leaveRoomPayload): Promise<any> {
    try {
      const { roomId } = payload;
      const roomInfo: RoomInfo = await this.cacheService.getRoomInfo(roomId);
      const roomMember: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));

      await leaveSocketRoom(client, roomId);

      roomInfo.members.delete(roomMember.id);
      await this.cacheService.setRoomInfo(roomId, roomInfo);

      await sendMessageRoomMemberLeaved(server, roomMember, roomId);

      return roomInfo;
    } catch (e) {
      throw e;
    }
  }
}
