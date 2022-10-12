import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    const roomList: Room[] = await this.roomsService.findAll();
    return roomList;
  }

  @Post()
  /**
   * @todo - need authGuard, get user info
   */
  @UseGuards()
  createRoom(@Body() createRoomDto: CreateRoomDto): any {
    const craetedRoom = this.roomsService.create(createRoomDto);

    return craetedRoom;
  }
}
