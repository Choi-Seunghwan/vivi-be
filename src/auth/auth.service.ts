import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private saltOrRounds = 10;

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    if (!password.length) throw new Error('none password string');

    const salt = await bcrypt.genSalt(this.saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async validateUserPassword(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findOneWithEmail(email);
    const compareResult: boolean = await bcrypt.compare(user?.password, password);

    if (compareResult) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = { id: user.id, username: user.nickname };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
