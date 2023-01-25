import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { userInfoFactory } from 'src/users/user.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_PRIVATE_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: TokenPayload): Promise<UserInfo | boolean> {
    const rawToken = req.headers['authorization'].split(' ')[1];
    const { email } = payload;
    const user: User = await this.authService.validateUser(email);

    if (!user) return false;

    const userInfo = userInfoFactory(user, rawToken);
    return userInfo;
  }
}
