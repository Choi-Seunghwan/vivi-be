import { Injectable, Logger } from '@nestjs/common';
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
import { RoomNotFoundException, RoomCreateFailException, RoomStatusException, HostAlreadyRoomInProgress } from 'src/common/room.exception';
import type { Room as SocketRoom } from 'socket.io-adapter';
import { ROOM_STATUS } from 'src/constants/room.constant';

@Injectable()
export class RoomsGatewayService {
  logger = new Logger(RoomsGatewayService.name);

  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>, private cacheService: CacheService) {}

  async onDisconnection(server: SocketIoServer, client: Socket) {
    // const rooms: Set<SocketRoom> = client.rooms;
    // const userInfo: UserInfo = getUserInfoFromSocket(client);
  }

  async getRoomList(client: Socket) {
    const rooms = await this.roomRepository.find({});
    return rooms;
  }

  async onCreateRoom(server: SocketIoServer, client: Socket, payload: CreateRoomPayload): Promise<RoomInfo> {
    try {
      const { title } = payload;
      const userInfo: UserInfo = getUserInfoFromSocket(client);

      const rooms: Room[] = await this.roomRepository.find({ where: { host: { id: userInfo.id }, status: ROOM_STATUS.IN_PROGRESS } });

      if (rooms.length) throw new HostAlreadyRoomInProgress();

      const createdRoom: Room = this.roomRepository.create({
        host: userInfo,
        title,
        status: ROOM_STATUS.IN_PROGRESS,
        startDate: new Date(),
      });
      await this.roomRepository.save(createdRoom);

      if (!createdRoom) throw new RoomCreateFailException({ args: { rooms } });

      await joinSocketRoom(client, createdRoom.id);
      const roomInfo: RoomInfo = await roomInfoFactory(server, createdRoom, userInfo);
      return roomInfo;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async onJoinRoom(server: SocketIoServer, client: Socket, payload: joinRoomPayload): Promise<RoomInfo> {
    try {
      const { roomId } = payload;
      const member: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));
      const room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (!room) throw new RoomNotFoundException();
      if (room?.status !== ROOM_STATUS.IN_PROGRESS) throw new RoomStatusException();

      await joinSocketRoom(client, roomId);
      await sendMessageNewRoomMemberJoined(client, member, roomId);

      const roomInfo = await roomInfoFactory(server, room, room.host);

      return roomInfo;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async onCloseRoom(server: SocketIoServer) {}

  async onLeaveRoom(server: SocketIoServer, client: Socket, roomId: string): Promise<any> {
    try {
      const roomMember: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));
      const room = await this.roomRepository.findOne({ where: { id: roomId } });

      const isHostLeave = roomMember.id === room?.host?.id;

      if (isHostLeave) {
        await hostLeaveSocketRoom(server, roomId);
        await this.roomRepository.update(room, { status: ROOM_STATUS.CLOSED, endDate: Date.now() });
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
