import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloseRoomDto } from './dto/close-room.dto';

@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    const roomList: Room[] = await this.roomsService.findAll();
    return roomList;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    const user = req.user;
    const craetedRoom = await this.roomsService.create(user, createRoomDto);

    return craetedRoom;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/close')
  async closeRoom(@Request() req, @Body() closeRoomDto: CloseRoomDto) {
    const user = req.user;
    const result = await this.roomsService.close(user, closeRoomDto);

    return result;
  }
}
