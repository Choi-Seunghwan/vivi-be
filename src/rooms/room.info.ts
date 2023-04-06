import { UserInfo } from 'src/types/auth';

export class RoomInfo {
  roomId: string;
  host: RoomMember | UserInfo;
  title: string;
  members: RoomMember[];

  constructor({ roomId, host, title }: { roomId: string; host: RoomMember; title: string }) {
    this.roomId = roomId;
    this.host = host;
    this.title = title;
    this.members = [];
  }
}
