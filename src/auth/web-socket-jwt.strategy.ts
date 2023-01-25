import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { userInfoFactory } from 'src/users/user.utils';

@Injectable()
export class WebSocketJwtStrategy extends PassportStrategy(Strategy, 'webSocketJwt') {
  constructor(private configService: ConfigService, private authService: AuthService) {
    const JWT_PRIVATE_KEY = configService.get('JWT_PRIVATE_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PRIVATE_KEY,
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
