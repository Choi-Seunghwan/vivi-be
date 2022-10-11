import { IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
