import { ROOM_STATUS } from 'src/constants/room.constant';
import { Socket } from 'socket.io';
import { User } from 'src/users/user.entity';
import { Room } from './room.entity';
import { RoomInfo } from './room.info';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UserInfo } from 'src/types/auth';

export const roomInfoFactory = async (server: Server, room: Room, host: RoomMember): Promise<RoomInfo> => {
  const roomInfo: RoomInfo = new RoomInfo({ roomId: room.id, title: room.title, host });
  const socketMembers = await server.in(room.id).fetchSockets();

  roomInfo.members = socketMembers.map((sMember) => sMember.handshake?.['user']);

  return roomInfo;
};

export const roomMemberFactory = (userInfo: UserInfo): RoomMember => {
  const { id, email, nickname, socketId } = userInfo;

  const roomMember: RoomMember = { id, email, nickname, socketId };
  return roomMember;
};

export const isRoomHost = (user: UserInfo, room: Room): boolean => {
  return room?.host?.id === user?.id;
};

export const isRoomStatusInProgress = (room: Room): boolean => {
  return getRoomStatus(room) === ROOM_STATUS.IN_PROGRESS;
};

export const getRoomStatus = (room: Room): string => {
  return room?.status;
};
