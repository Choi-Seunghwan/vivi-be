import { Socket } from 'socket.io';

export const getUserInfoFromSocket = (socket: Socket): UserInfo | undefined => {
  const userInfo: UserInfo = socket?.handshake?.['user'];
  return userInfo;
};

export const joinSocketRoom = async (socket: Socket, roomId: string) => {
  try {
    socket.rooms;
    const result = await socket.join(roomId);
    return result;
  } catch (e) {
    throw e;
  }
};

export const leaveSocketRoom = async (socket: Socket, roomId: string) => {
  try {
  } catch (e) {
    throw e;
  }
};
