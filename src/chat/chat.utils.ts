import { User } from 'src/users/user.entity';
import { ChatMessage } from './chat-message.entity';
import { v4 as uuid } from 'uuid';

export const generateChatMessage = ({ user, message, roomId }: { user: User; message: string; roomId: string }) => {
  //  need use repository
  // const chatMessageId = uuid();
  // const chatMessage: ChatMessage = { id: chatMessageId, user, message, room: roomId };
};
