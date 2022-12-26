import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CloseRoomDto } from './dto/close-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './room.entity';
import { isRoomHost, isRoomStatusInProgress, roomInfoFactory } from './room.utils';
import { NAMESPACE_ROOM } from 'src/constants';
import { CacheService } from 'src/cache/cache.service';
import { RoomNotFoundException, RoomStatusException } from './exceptions/room.exception';
import { ROOM_STATUS } from 'src/constants/room.constant';
import { startRoomDto } from './dto/start-room-dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private cacheService: CacheService
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async create(user: User, createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const createdRoom: Room = this.roomRepository.create({ host: user, title: createRoomDto.title });
      await this.roomRepository.save(createdRoom);

      const roomInfo: RoomInfo = roomInfoFactory(createdRoom);

      await this.cacheService.set(NAMESPACE_ROOM, 'room', roomInfo);

      return createdRoom;
    } catch (e) {
      throw e;
    }
  }

  async start(user: User, startRoomDto: startRoomDto): Promise<boolean> {
    try {
      const { roomId } = startRoomDto;
      const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (isRoomHost(user, room)) throw new RoomNotFoundException();
      if (!isRoomStatusInProgress(room)) throw new RoomStatusException();

      const startDate = new Date();
      room.startDate = startDate;
      room.status = ROOM_STATUS.IN_PROGRESS;

      await this.roomRepository.save(room);

      return true;
    } catch (e) {
      throw e;
    }
  }

  async close(user: User, closeRoomDto: CloseRoomDto): Promise<boolean> {
    try {
      const { roomId } = closeRoomDto;
      const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (isRoomHost(user, room)) throw new RoomNotFoundException();
      if (!isRoomStatusInProgress(room)) throw new RoomStatusException();

      const endDate = new Date();
      room.endDate = endDate;
      room.status = ROOM_STATUS.CLOSED;

      await this.roomRepository.save(room);

      return true;
    } catch (e) {
      throw e;
    }
  }
}
