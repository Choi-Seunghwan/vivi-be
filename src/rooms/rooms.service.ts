import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CloseRoomDto } from './dto/close-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './room.entity';
import { isRoomHost, isRoomStatusInProgress, roomInfoFactory, roomMemberFactory } from './room.utils';
import { CacheService } from 'src/cache/cache.service';
import { ROOM_STATUS } from 'src/constants/room.constant';
import { startRoomDto } from './dto/start-room-dto';
import { RoomInfo } from './room.info';
import { RoomNotFoundException, RoomStatusException } from 'src/common/room.exception';

@Injectable()
export class RoomsService {
  logger = new Logger(RoomsService.name);

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private cacheService: CacheService
  ) {}

  async getRoomList(server): Promise<RoomInfo[]> {
    try {
      const rooms: Room[] = await this.roomRepository.find({ where: { status: ROOM_STATUS.IN_PROGRESS }, relations: ['host'] });
      const roomInfos = Promise.all(
        rooms.map(async (r) => {
          const roomMember = roomMemberFactory(r.host);
          const roomInfo = await roomInfoFactory(server, r, roomMember);
          return roomInfo;
        })
      );
      return roomInfos;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /*
  async create(server, user: User, createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const createdRoom: Room = this.roomRepository.create({ host: user, title: createRoomDto.title, status: ROOM_STATUS.IN_PROGRESS });
      await this.roomRepository.save(createdRoom);

      const roomInfo: RoomInfo = await roomInfoFactory(server, createdRoom, user);
      // await this.cacheService.setRoomInfo('room', roomInfo);

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
  */
}
