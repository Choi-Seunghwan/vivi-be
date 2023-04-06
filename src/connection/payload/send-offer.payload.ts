import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendOfferPayload {
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsObject()
  offer: object;
}
