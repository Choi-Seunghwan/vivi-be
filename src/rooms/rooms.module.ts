import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { Room } from './room.entity';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { RoomsGatewayService } from './rooms.gateway.service';
import { AppCacheModule } from 'src/cache/cache.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), AppCacheModule, forwardRef(() => AuthModule)],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway, RoomsGatewayService],
})
export class RoomsModule {}
