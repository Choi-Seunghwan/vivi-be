import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendAnswerPayload {
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsObject()
  answer: object;
}
