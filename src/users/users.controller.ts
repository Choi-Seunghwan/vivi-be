import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { SignInUserDto } from './dto/sign-in-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInUserDto) {}

  /** 테스트용 */
  // @Get('/all')
  // async findAll(): Promise<User[] | void> {
  //   const users: User[] = await this.userService.findAll();
  //   return users;
  // }

  // @Get('/')
  // async findOne(@Query() id: number): Promise<User | void> {
  //   const user = await this.userService.findOne(id);
  //   return user;
  // }
}
