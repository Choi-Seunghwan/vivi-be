import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private RoomInfoRepository: Repository<Room>
  ) {}

  findAll(): Promise<Room[]> {
    return this.RoomInfoRepository.find();
  }

  async create({ title }): Promise<Room> {
    const createdRoom: Room = this.RoomInfoRepository.create({ title });

    return createdRoom;
  }
}
