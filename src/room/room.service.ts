import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  create(room: Room) {}
}
