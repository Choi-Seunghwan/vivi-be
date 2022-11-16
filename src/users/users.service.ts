import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [];

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    const allUserList: User[] = await this.userRepository.find();
    return allUserList;
  }

  async getUser(email: string, allInfo: boolean = false): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) return null; // or throw

    if (allInfo) return user;

    const userInfo = { email: user.email, nickname: user.nickname, createdDate: user.createdDate };
    return userInfo;
  }
}
