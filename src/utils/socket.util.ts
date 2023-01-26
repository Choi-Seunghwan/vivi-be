import { Server as SocketIoServer, Socket } from 'socket.io';
import { ChatMessage } from 'src/chat/chat-message.entity';
import {
  SocketAlreadyInRoomException,
  SocketJoinFailException,
  SocketLeaveFailException,
  SocketLeaveHostFailException,
  SocketNotInRoomException,
} from 'src/common/common.exception';
import {
  MESSAGE_NEW_ROOM_MEMBER_JOINED,
  MESSAGE_ROOM_CHAT_MESSAGE,
  MESSAGE_ROOM_HOST_LEAVED,
  MESSAGE_ROOM_MEMBER_LEAVED,
} from 'src/constants/message.constant';

export const getUserInfoFromSocket = (socket: Socket): UserInfo | undefined => {
  const userInfo: UserInfo = socket?.handshake?.['user'];
  return userInfo;
};

export const joinSocketRoom = async (socket: Socket, roomId: string): Promise<void> => {
  try {
    if (socket.rooms.has(roomId)) throw new SocketAlreadyInRoomException();

    await socket.join(roomId);
  } catch (e) {
    if (e instanceof SocketAlreadyInRoomException) throw e;
    throw new SocketJoinFailException(e);
  }
};

export const leaveSocketRoom = async (socket: Socket, roomId: string) => {
  try {
    if (socket.rooms.has(roomId)) throw new SocketNotInRoomException();

    await socket.leave(roomId);
  } catch (e) {
    if (e instanceof SocketNotInRoomException) throw e;
    throw new SocketLeaveFailException(e);
  }
};

export const hostLeaveSocketRoom = async (server: SocketIoServer, roomId) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM_HOST_LEAVED, { roomId });
    server.in(roomId).socketsLeave(roomId);
  } catch (e) {
    throw new SocketLeaveHostFailException(e);
  }
};

export const sendMessageNewRoomMemberJoined = async (socket: Socket, roomMember: RoomMember, roomId: string) => {
  try {
    socket.to(roomId).emit(MESSAGE_NEW_ROOM_MEMBER_JOINED, { roomMember, roomId });
  } catch (e) {
    throw e;
  }
};

export const sendMessageRoomMemberLeaved = async (server: SocketIoServer, roomMember: RoomMember, roomId: string) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM_MEMBER_LEAVED, { roomMember, roomId });
  } catch (e) {
    throw e;
  }
};

export const sendMessageRoomHostLeaved = async (server: SocketIoServer, roomId: string) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM_MEMBER_LEAVED, { roomId });
  } catch (e) {
    throw e;
  }
};

export const sendChatMessageToRoom = (server: SocketIoServer, roomId: string, chatMessage: ChatMessage) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM_CHAT_MESSAGE, { message: chatMessage });
  } catch (e) {
    throw e;
  }
};
