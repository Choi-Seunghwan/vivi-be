import { IsNotEmpty, IsString } from 'class-validator';

export class CloseRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
