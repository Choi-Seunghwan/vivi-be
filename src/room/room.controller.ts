import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll(): void {}

  // @Post()
  // createRoom(@Body() createRoomDto: CreateRoomDto): RoomDto {
  //   const room = { name: createRoomDto.title };
  //   const craetedRoom = this.roomService.create(room);
  // }
}
