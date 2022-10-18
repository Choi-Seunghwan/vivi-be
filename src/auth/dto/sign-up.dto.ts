import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
