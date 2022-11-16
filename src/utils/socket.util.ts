import { Socket } from 'socket.io';

export const joinSocketRoom = async (socket: Socket, roomId: string) => {
  try {
    const result = await socket.join(roomId);
    return result;
  } catch (e) {
    throw e;
  }
};
