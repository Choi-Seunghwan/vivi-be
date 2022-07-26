import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private saltOrRounds = 10;

  constructor(private usersService: UsersService) {}

  async hashPassword(password: string) {
    if (!password.length) throw new Error('none password string');

    const salt = await bcrypt.genSalt(this.saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
