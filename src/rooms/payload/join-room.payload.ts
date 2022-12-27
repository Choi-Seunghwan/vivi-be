import { IsNotEmpty, IsString } from 'class-validator';

export class joinRoomPayload {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
