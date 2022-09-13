import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev'],
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    RoomModule,
    NetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
