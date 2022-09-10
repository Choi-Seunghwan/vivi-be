import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto } from './dto/room.dto';
import { Room } from './room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    const roomList: Room[] = await this.roomService.findAll();
    return roomList;
  }

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): any {
    const room = { title: createRoomDto.title };
    const craetedRoom = this.roomService.create(room);
    return craetedRoom;
  }
}
