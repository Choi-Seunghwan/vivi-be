import { Body, Controller, Get, HttpException, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/types/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /** 테스트용 */
  @Get('/all')
  async findAll(@Request() req): Promise<User[] | void> {
    const users: User[] = await this.userService.getAllUsers();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async findOne(@Request() req): Promise<User | void> {
    const payload: TokenPayload = req?.user;
    const { email } = payload;
    const userInfo = await this.userService.getUser(email);

    if (!userInfo) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    return userInfo;
  }
}
