import { ROOM_STATUS } from 'src/constants/room.constant';
import { User } from 'src/users/user.entity';
import { Room } from './room.entity';
import { RoomInfo } from './room.info';

export const roomInfoFactory = (room: Room, userInfo: UserInfo): RoomInfo => {
  const roomInfo: RoomInfo = new RoomInfo({ roomId: room.id, title: room.title, host: userInfo });
  return roomInfo;
};

export const roomMemberFactory = (userInfo: UserInfo): RoomMember => {
  const { id, email, nickname } = userInfo;
  const roomMember: RoomMember = { id, email, nickname };
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
