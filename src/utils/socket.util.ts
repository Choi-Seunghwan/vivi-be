import { Socket } from 'socket.io';
import { SocketJoinFailException } from 'src/common/common.exception';

export const getUserInfoFromSocket = (socket: Socket): UserInfo | undefined => {
  const userInfo: UserInfo = socket?.handshake?.['user'];
  return userInfo;
};

export const joinSocketRoom = async (socket: Socket, roomId: string): Promise<void> => {
  try {
    // socket.rooms;
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
