import { RoomInfo } from './room.info';

class RoomMap {
  /**
   * key: roomId
   */
  private map: Map<string, RoomInfo> = new Map();

  setRoom(key: string, room: RoomInfo): boolean {
    try {
      this.map.set(key, room);

      return true;
    } catch (e) {
      return false;
    }
  }

  getRoom(key: string): RoomInfo {
    const room: RoomInfo = this.map.get(key);
    return room;
  }
}

export const roomMap = new RoomMap();
