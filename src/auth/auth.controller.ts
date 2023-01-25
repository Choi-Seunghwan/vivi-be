import { Body, Controller, Headers, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { userInfoFactory } from 'src/users/user.utils';
import { AuthUserInfo } from 'src/users/user.decorator';
// async temp(@Headers('Authorization') auth){} - param Decorator
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(201)
  async signUp(@Body() dto: SignUpDto): Promise<{ user: UserInfo; token: string }> {
    const { userInfo, token } = await this.authService.signUp(dto);
    return { user: userInfo, token };
  }

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async signIn(@Request() req, @Body() dto: SignInDto): Promise<{ user: UserInfo; token: string }> {
    const user: User = req.user;
    const token = await this.authService.signIn(dto);
    const userInfo = userInfoFactory(user);
    return { user: userInfo, token };
  }

  @Post('/token-sign-in')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async tokenSignIn(@AuthUserInfo() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
  }
}
