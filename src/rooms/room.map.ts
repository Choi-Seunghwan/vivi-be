import { Room } from './room.entity';

class RoomMap {
  private map: Map<String, Room> = new Map();

  setRoom(key: String, room: Room): boolean {
    try {
      this.map.set(key, room);

      return true;
    } catch (e) {
      return false;
    }
  }

  getRoom(key: String): Room {
    const room: Room = this.map.get(key);
    return room;
  }
}

export const roomMap = new RoomMap();
