import { Room } from './room.entity';

export const createRoomInfo = (room: Room): RoomInfo => {
  const roomInfo: RoomInfo = { roomId: room.id, title: room.title };
  return roomInfo;
};
