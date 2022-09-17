import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomLog } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomLog)
    private roomLogRepository: Repository<RoomLog>
  ) {}

  findAll(): Promise<RoomLog[]> {
    return this.roomLogRepository.find();
  }

  create({ title }) {
    const createdRoom = this.roomLogRepository.create({ title });
    return createdRoom;
  }
}
