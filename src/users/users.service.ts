import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [];

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const password = createUserDto?.password;
    const hashedPassword = await this.authService.hashPassword(password);
    const createdUser = await this.userRepository.save({ ...createUserDto, password: hashedPassword });
    return createdUser;
  }

  /** 테스트용 */
  async findAll(): Promise<User[]> {
    const result = await this.userRepository.find();
    return result;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
