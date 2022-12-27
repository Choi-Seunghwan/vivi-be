import { IsNotEmpty, IsString } from 'class-validator';

export class leaveRoomPayload {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
