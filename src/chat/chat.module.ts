import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatGatewayService } from './chat.gateway.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage]), forwardRef(() => AuthModule)],
  providers: [ChatGateway, ChatGatewayService],
})
export class ChatModule {}
