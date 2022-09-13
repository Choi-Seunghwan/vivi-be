import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
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
    const craetedRoom = this.roomService.create(createRoomDto);
    return craetedRoom;
  }
}
