import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomService } from './room.service';
import { RoomLog } from './room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(): Promise<RoomLog[]> {
    const roomList: RoomLog[] = await this.roomService.findAll();
    return roomList;
  }

  // @Post()
  // createRoom(@Body() createRoomDto: CreateRoomDto): any {
  //   const craetedRoom = this.roomService.create(createRoomDto);
  //   return craetedRoom;
  // }
}
