import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomLog } from './room.entity';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomLog])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
