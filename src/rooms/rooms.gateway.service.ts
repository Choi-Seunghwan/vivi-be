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
  sendChatMessageToClient,
  sendMessageNewRoomMemberJoined,
  sendMessageRoomMemberLeaved,
} from 'src/utils/socket.util';
import { CacheService } from 'src/cache/cache.service';
import { roomInfoFactory, roomMemberFactory } from './room.utils';
import { joinRoomPayload } from './payload/join-room.payload';
import { RoomInfo } from './room.info';
import { RoomNotFoundException, RoomCreateFailException, RoomStatusException, HostAlreadyRoomInProgress } from 'src/common/room.exception';
import { ROOM_STATUS } from 'src/constants/room.constant';
import { ChatMessage } from '../chat/chat-message.entity';
import { CHAT_MESSAGE_TYPE_SYSTEM, SYSTEM_CHAT_MESSAGE_ROOM_CREATED, SYSTEM_CHAT_MESSAGE_ROOM_MEMBER_JOINED } from 'src/chat/chat.constant';
import { WsException } from '@nestjs/websockets';
import { UserInfo } from 'src/types/auth';

@Injectable()
export class RoomsGatewayService {
  logger = new Logger(RoomsGatewayService.name);

  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(ChatMessage) private chatMessageRepository: Repository<ChatMessage>,
    private cacheService: CacheService
  ) {}

  async onDisconnection(server: SocketIoServer, client: Socket) {
    const room: string = client?.data?.room;
    // const userInfo: UserInfo = getUserInfoFromSocket(client);
    if (room) this.onLeaveRoom(server, client, room);
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

      // if (rooms.length) throw new HostAlreadyRoomInProgress();

      const createdRoom: Room = this.roomRepository.create({
        host: userInfo,
        title,
        status: ROOM_STATUS.IN_PROGRESS,
        startDate: new Date(),
      });
      await this.roomRepository.save(createdRoom);

      if (!createdRoom) throw new RoomCreateFailException({ args: { rooms } });

      await joinSocketRoom(client, createdRoom.id);

      const systemChatMessage: ChatMessage = this.chatMessageRepository.create({
        room: { id: createdRoom.id },
        messageInfo: { message: SYSTEM_CHAT_MESSAGE_ROOM_CREATED },
        type: CHAT_MESSAGE_TYPE_SYSTEM,
      });
      await sendChatMessageToClient(client, systemChatMessage);

      const roomInfo: RoomInfo = await roomInfoFactory(server, createdRoom, userInfo);
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

      if (!room) throw new RoomNotFoundException();
      if (room?.status !== ROOM_STATUS.IN_PROGRESS) throw new RoomStatusException();

      await joinSocketRoom(client, roomId);

      const systemChatMessage: ChatMessage = this.chatMessageRepository.create({
        room: { id: room.id },
        messageInfo: { message: SYSTEM_CHAT_MESSAGE_ROOM_MEMBER_JOINED, nickname: member.nickname },
        type: CHAT_MESSAGE_TYPE_SYSTEM,
      });
      await sendMessageNewRoomMemberJoined(server, member, roomId, systemChatMessage);

      const roomInfo = await roomInfoFactory(server, room, room.host);

      return roomInfo;
    } catch (e) {
      throw e;
    }
  }

  async onLeaveRoom(server: SocketIoServer, client: Socket, roomId: string): Promise<any> {
    try {
      const roomMember: RoomMember = roomMemberFactory(getUserInfoFromSocket(client));
      const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['host'] });

      const isHostLeave = roomMember.id === room?.host?.id;

      if (isHostLeave) {
        await hostLeaveSocketRoom(server, roomId);
        await this.roomRepository.update(room.id, { status: ROOM_STATUS.CLOSED, endDate: new Date() });
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
