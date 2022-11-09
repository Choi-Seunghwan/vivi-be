import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async create(user: User, createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const createdRoom: Room = this.roomRepository.create({ host: user, title: createRoomDto.title });
      await this.roomRepository.save(createdRoom);
      return createdRoom;
    } catch (e) {
      throw e;
    }
  }
}
