import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomInfo } from './room-info.entity';
import { RoomGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomInfo])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomGateway],
})
export class RoomsModule {}
