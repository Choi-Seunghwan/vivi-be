import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    const httpBasicName = this.configService.get('BASIC_AUTH_NAME');
    const httpBasicPw = this.configService.get('BASIC_AUTH_PW');

    if (httpBasicName === username && httpBasicPw === password) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
