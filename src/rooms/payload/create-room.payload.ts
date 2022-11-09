import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomPayload {
  @IsString()
  roomId: string;

  @IsString()
  userId: string;
}
