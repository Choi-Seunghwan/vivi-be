import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/sign-in-dto';

@Injectable()
export class AuthService {
  private saltOrRounds = 10;

  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async hashPassword(password: string): Promise<string> {
    if (!password.length) throw new Error('none password string');

    const salt = await bcrypt.genSalt(this.saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async validateUser(email: string): Promise<User> {
    const user: User = await this.usersService.getUser(email, true);
    return user;
  }

  async validateUserPassword(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.getUser(email, true);

    if (!user) return null;

    const compareResult: boolean = await bcrypt.compare(password, user?.password);

    if (compareResult) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async signUp(dto: SignUpDto): Promise<User> {
    const password = dto?.password;
    const hashedPassword = await this.hashPassword(password);
    const createdUser: User = await this.userRepository.save({ ...dto, password: hashedPassword });

    return createdUser;
  }

  async signIn(dto: SignInDto) {
    const { email } = dto;
    return {
      access_token: this.jwtService.sign({ email }),
    };
  }
}
