import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateRoomPayload } from './payload/create-room.payload';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RoomsGatewayService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>) {}

  async onCreateRoom(client: Socket, payload: CreateRoomPayload) {
    const { userId, roomId } = payload;

    const room: Room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) throw new WsException('roomId error');
  }

  async onJoinRoom(client: Socket, payload) {}
}
