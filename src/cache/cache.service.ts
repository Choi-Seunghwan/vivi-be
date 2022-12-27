import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { NAMESPACE_ROOM } from 'src/constants';
import { RoomInfo } from 'src/rooms/room.info';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(namespace: string, key: string, value: any) {
    const keyStr = `${namespace}:${key}`;
    const result = await this.cacheManager.set(keyStr, value);

    return result;
  }

  async get(namespace: string, key: string) {
    const keyStr = `${namespace}:${key}`;
    const result = await this.cacheManager.get(keyStr);

    return result;
  }

  /** 
   * warn
  async clear(namespace: string) {
    const result = await this.cacheManager.reset();
    return result;
  }
  */

  async setRoomInfo(roomId: string, roomInfo: RoomInfo) {
    const keyStr = `${NAMESPACE_ROOM}:${roomId}`;
    const result = await this.cacheManager.set(keyStr, roomInfo);
    return result;
  }

  async getRoomInfo(roomId: string) {
    const keyStr = `${NAMESPACE_ROOM}:${roomId}`;
    const roomInfo: RoomInfo = await this.cacheManager.get(keyStr);
    return roomInfo;
  }
}
