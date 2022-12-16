import { ROOM_STATUS } from 'src/constants/room.constant';
import { User } from 'src/users/user.entity';
import { Room } from './room.entity';

export const roomInfoFactory = (room: Room): RoomInfo => {
  const roomInfo: RoomInfo = { roomId: room.id, title: room.title };
  return roomInfo;
};

export const isRoomHost = (user: User, room: Room): boolean => {
  return room?.host?.id === user?.id;
};

export const isRoomStatusInProgress = (room: Room): boolean => {
  return getRoomStatus(room) === ROOM_STATUS.IN_PROGRESS;
};

export const getRoomStatus = (room: Room): ROOM_STATUS => {
  return room?.status;
};
