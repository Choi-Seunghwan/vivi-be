import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class sendIceCandidate {
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsObject()
  candidate: object;
}
