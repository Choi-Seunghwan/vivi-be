import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomsService } from './rooms.service';
import { RoomInfo } from './room-info.entity';

@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(): Promise<RoomInfo[]> {
    const roomList: RoomInfo[] = await this.roomsService.findAll();
    return roomList;
  }

  // @Post()
  // createRoom(@Body() createRoomDto: CreateRoomDto): any {
  //   const craetedRoom = this.roomService.create(createRoomDto);
  //   return craetedRoom;
  // }
}
