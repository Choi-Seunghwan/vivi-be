import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomPayload {
  @IsNotEmpty()
  @IsString()
  title: string;
}
