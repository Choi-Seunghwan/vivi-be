import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
