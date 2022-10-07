import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomInfo } from './room-info.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomInfo)
    private RoomInfoRepository: Repository<RoomInfo>
  ) {}

  findAll(): Promise<RoomInfo[]> {
    return this.RoomInfoRepository.find();
  }

  create({ title }) {
    const roomInfo = this.RoomInfoRepository.create({ title });

    // const createdRoom: Room =

    // return createdRoom;
  }
}
