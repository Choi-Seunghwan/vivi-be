import { Injectable } from '@nestjs/common';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getUserInfoFromSocket,
  hostLeaveSocketRoom,
  joinSocketRoom,
  leaveSocketRoom,
  sendMessageNewRoomMemberJoined,
  sendMessageRoomMemberLeaved,
} from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';
import { roomInfoFactory, roomMemberFactory } from './room.utils';
import { joinRoomPayload } from './payload/join-room.payload';
import { RoomInfo } from './room.info';
import { RoomCreateFailException, RoomStatusException } from 'src/common/room.exception';
import type { Room as SocketRoom } from 'socket.io-adapter';
import { ROOM_STATUS } from 'src/constants/room.constant';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async onDisconnection(server: SocketIoServer, client: Socket) {
    const rooms: Set<SocketRoom> = client.rooms;

    rooms.forEach((roomId) => {
      this.onLeaveRoom(server, client, roomId);
    });
  }

  async getRoomList(client: Socket) {
    const rooms = await this.roomRepository.find({});
    return rooms;
  }

  async onCreateRoom(server: SocketIoServer, client: Socket, payload: CreateRoomPayload): Promise<RoomInfo> {
    try {
      const { title } = payload;
      const userInfo: UserInfo = getUserInfoFromSocket(client);

      const createdRoom: Room = this.roomRepository.create({ host: userInfo, title, status: ROOM_STATUS.IN_PROGRESS });
      await this.roomRepository.save(createdRoom);

      if (!createdRoom) throw new RoomCreateFailException();

      await joinSocketRoom(client, createdRoom.id);
      const roomInfo = await roomInfoFactory(server, createdRoom, userInfo);
      return roomInfo;
    } catch (e) {
      throw e;
    }
  }

  async onJoinRoom(server: SocketIoServer, client: Socket, payload: joinRoomPayload): Promise<RoomInfo> {
    try {
      const { roomId } = payload;
      const member: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));
      const room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (room.status !== ROOM_STATUS.IN_PROGRESS) throw new RoomStatusException();

      await joinSocketRoom(client, roomId);
      await sendMessageNewRoomMemberJoined(client, member, roomId);

      const roomInfo = await roomInfoFactory(server, room, room.host);

      return roomInfo;
    } catch (e) {
      throw e;
    }
  }

  async onLeaveRoom(server: SocketIoServer, client: Socket, roomId: string): Promise<any> {
    try {
      const roomMember: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));
      const room = await this.roomRepository.findOne({ where: { id: roomId } });

      const isHostLeave = roomMember.id === room?.host?.id;

      if (isHostLeave) {
        await hostLeaveSocketRoom(server, roomId);
        await this.roomRepository.update(room, { status: ROOM_STATUS.CLOSED });
      } else {
        await leaveSocketRoom(client, roomId);
        await sendMessageRoomMemberLeaved(server, roomMember, roomId);
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}
