import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @todo - return 값 확인
   */
  @Post('/sign-up')
  @HttpCode(204)
  async signUp(@Body() dto: SignUpDto): Promise<User> {
    const createdUser: User = await this.authService.signUp(dto);
    return createdUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(@Request() req, @Body() dto: SignInDto): Promise<any> {
    const user: User = req.user;
    const payload = await this.authService.signIn(dto);
    return { email: user.email, nickname: user.nickname, createdDate: user.createdDate, ...payload };
  }
}
