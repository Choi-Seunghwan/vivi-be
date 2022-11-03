import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/room.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        host: configService.get('DATABASE_HOST'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Room],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
