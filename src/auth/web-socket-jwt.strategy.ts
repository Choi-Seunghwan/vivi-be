import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class WebSocketJwtStrategy extends PassportStrategy(Strategy, 'webSocketJwt') {
  constructor(private configService: ConfigService, private authService: AuthService) {
    const JWT_PRIVATE_KEY = configService.get('JWT_PRIVATE_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PRIVATE_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    const user: User = await this.authService.validateUser(email);

    if (!user) return false;

    const { password, ...result } = user;
    return result;
  }
}
