import { IsNotEmpty, IsString } from 'class-validator';

export class SendRoomChatMessage {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
