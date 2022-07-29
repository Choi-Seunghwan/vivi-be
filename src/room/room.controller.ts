import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto } from './dto/room.dto';

@Controller('room')
export class RoomController {
  @Get()
  findAll(): void {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): RoomDto {}
}
