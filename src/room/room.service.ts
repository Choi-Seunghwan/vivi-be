import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  create(room: Room) {
    const createdRoom = this.roomRepository.create(room);
    return createdRoom;
  }
}
