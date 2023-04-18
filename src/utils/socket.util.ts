import { Server as SocketIoServer, Socket } from 'socket.io';
import { ChatMessage } from 'src/chat/chat-message.entity';
import {
  SocketAlreadyInRoomException,
  SocketJoinFailException,
  SocketLeaveFailException,
  SocketLeaveHostFailException,
  SocketNotInRoomException,
} from 'src/common/common.exception';
import { MESSAGE_CHAT, MESSAGE_PC, MESSAGE_ROOM } from 'src/constants/message.constant';
import { UserInfo } from 'src/types/auth';

export const getUserInfoFromSocket = (socket: Socket): UserInfo | undefined => {
  const userInfo: UserInfo = socket?.data?.['user'];
  return userInfo;
};

export const joinSocketRoom = async (socket: Socket, roomId: string): Promise<void> => {
  try {
    if (socket.rooms.has(roomId)) throw new SocketAlreadyInRoomException();

    await socket.join(roomId);
    socket.data.room = roomId;
  } catch (e) {
    if (e instanceof SocketAlreadyInRoomException) throw e;
    throw new SocketJoinFailException();
  }
};

export const leaveSocketRoom = async (socket: Socket, roomId: string) => {
  try {
    if (socket.rooms.has(roomId)) throw new SocketNotInRoomException();

    await socket.leave(roomId);
    socket.data.room = undefined;
  } catch (e) {
    if (e instanceof SocketNotInRoomException) throw e;
    throw new SocketLeaveFailException();
  }
};

export const hostLeaveSocketRoom = async (server: SocketIoServer, roomId: string) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM.HOST_LEAVED, { roomId });
    server.socketsLeave(roomId);
  } catch (e) {
    throw new SocketLeaveHostFailException();
  }
};

export const sendMessageNewRoomMemberJoined = async (
  server: SocketIoServer,
  roomMember: RoomMember,
  roomId: string,
  chatMessage: ChatMessage
) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM.NEW_ROOM_MEMBER_JOINED, { roomMember, roomId, chatMessage });
  } catch (e) {
    throw e;
  }
};

export const sendMessageRoomMemberLeaved = async (server: SocketIoServer, roomMember: RoomMember, roomId: string) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM.ROOM_MEMBER_LEAVED, { roomMember, roomId });
  } catch (e) {
    throw e;
  }
};

export const sendMessageRoomHostLeaved = async (server: SocketIoServer, roomId: string) => {
  try {
    server.in(roomId).emit(MESSAGE_ROOM.ROOM_MEMBER_LEAVED, { roomId });
  } catch (e) {
    throw e;
  }
};

export const sendChatMessageToClient = async (socket: Socket, chatMessage: ChatMessage) => {
  socket.emit(MESSAGE_CHAT.ROOM_CHAT_MESSAGE, chatMessage);
};

export const sendChatMessageToRoom = (server: SocketIoServer, roomId: string, chatMessage: ChatMessage) => {
  try {
    server.in(roomId).emit(MESSAGE_CHAT.ROOM_CHAT_MESSAGE, chatMessage);
  } catch (e) {
    throw e;
  }
};

export const sendOffer = (socket: Socket, { offer, socketId, member }) => {
  try {
    socket.to(socketId).emit(MESSAGE_PC.RECEIVE_OFFER, { offer, member });
  } catch (e) {
    throw e;
  }
};

export const sendAnswer = (socket: Socket, { answer, socketId, member }) => {
  try {
    socket.to(socketId).emit(MESSAGE_PC.RECEIVE_ANSWER, { answer, member });
  } catch (e) {
    throw e;
  }
};

export const sendIceCandidate = (socket: Socket, { candidate, socketId, member }) => {
  try {
    socket.to(socketId).emit(MESSAGE_PC.RECEIVE_ICE_CANDIDATE, { candidate, member });
  } catch (e) {
    throw e;
  }
};
