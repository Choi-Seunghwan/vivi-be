import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Request, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloseRoomDto } from './dto/close-room.dto';
import { startRoomDto } from './dto/start-room-dto';
import { RoomInfo } from './room.info';
import { RoomNotFoundException, RoomStatusException } from 'src/common/room.exception';
import { RoomsGateway } from './rooms.gateway';

@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService, private readonly roomsGateway: RoomsGateway) {}

  @Get('/')
  async getRooms(): Promise<RoomInfo[]> {
    const server = this.roomsGateway.server;
    const roomInfoList: RoomInfo[] = await this.roomsService.getRoomList(server);
    return roomInfoList;
  }

  /*
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    const server = this.roomsGateway.server;
    const user = req.user;
    const craetedRoom = await this.roomsService.create(server, user, createRoomDto);

    return craetedRoom;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/start')
  async startRoom(@Request() req, @Body() startRoomDto: startRoomDto) {
    try {
      const user = req.user;
      const result = await this.roomsService.start(user, startRoomDto);

      return result;
    } catch (e) {
      if (e === RoomNotFoundException) throw new BadRequestException();
      if (e === RoomStatusException) throw new BadRequestException();
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/close')
  async closeRoom(@Request() req, @Body() closeRoomDto: CloseRoomDto) {
    try {
      const user = req.user;
      const result = await this.roomsService.close(user, closeRoomDto);

      return result;
    } catch (e) {
      if (e === RoomNotFoundException) throw new BadRequestException();
      if (e === RoomStatusException) throw new BadRequestException();
      throw new InternalServerErrorException();
    }
  }
  */
}
