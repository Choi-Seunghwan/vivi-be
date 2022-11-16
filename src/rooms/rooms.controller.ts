import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto): any {
    const user = req.user;
    const craetedRoom = this.roomsService.create(user, createRoomDto);

    return craetedRoom;
  }
}
