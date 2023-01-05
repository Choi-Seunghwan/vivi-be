import { Socket } from 'socket.io';
import { SocketJoinFailException } from 'src/common/common.exception';
import { MESSAGE_NEW_ROOM_MEMBER_JOINED } from 'src/constants/message.constant';

export const getUserInfoFromSocket = (socket: Socket): UserInfo | undefined => {
  const userInfo: UserInfo = socket?.handshake?.['user'];
  return userInfo;
};

export const joinSocketRoom = async (socket: Socket, roomId: string): Promise<void> => {
  try {
    // socket.rooms;
    // if (true) throw new AlreadyJoinedRoomException();

    await socket.join(roomId);
  } catch (e) {
    throw new SocketJoinFailException(e);
  }
};

export const leaveSocketRoom = async (socket: Socket, roomId: string) => {
  try {
  } catch (e) {
    throw e;
  }
};

export const sendMessageNewRoomMemberJoined = async (socket: Socket, roomMember: RoomMember, roomId: string) => {
  try {
    socket.to(roomId).emit(MESSAGE_NEW_ROOM_MEMBER_JOINED, { roomMember, roomId });
  } catch (e) {
    throw e;
  }
};
