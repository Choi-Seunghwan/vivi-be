import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { Room } from './room.entity';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { RoomsGatewayService } from './rooms.gateway.service';
import { AppCacheModule } from 'src/cache/cache.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatMessage } from 'src/chat/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, ChatMessage]), AppCacheModule, forwardRef(() => AuthModule)],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway, RoomsGatewayService],
})
export class RoomsModule {}
