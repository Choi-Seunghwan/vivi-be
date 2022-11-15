import { Module, CacheModule } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_REDIS_HOST, ENV_REDIS_PORT } from 'src/constants';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        // username: configService.get<string>('REDIS_USERNAME'),
        // password: configService.get<string>('REDIS_PASSWORD'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get('REDIS_TTL'),
      }),
      isGlobal: true,
    }),
  ],
  providers: [CacheService],
  controllers: [CacheController],
  exports: [CacheService],
})
export class AppCacheModule {}
