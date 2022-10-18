import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(204)
  async signUp(@Body() dto: SignUpDto) {
    const createdUser: User = await this.authService.signUp(dto);
    return createdUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
