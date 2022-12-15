import { User } from 'src/users/user.entity';
import { Room } from './room.entity';

export const roomInfoFactory = (room: Room): RoomInfo => {
  const roomInfo: RoomInfo = { roomId: room.id, title: room.title };
  return roomInfo;
};

export const isRoomHost = (user: User, room: Room): boolean => {
  return room?.host?.id === user?.id;
};
