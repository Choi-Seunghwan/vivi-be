import { IsNotEmpty, IsString } from 'class-validator';

export class startRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
