export class RoomInfo {
  roomId: string;
  host: RoomMember;
  title: string;
  members: RoomMember[];

  constructor({ roomId, host, title }: { roomId: string; host: UserInfo; title: string }) {
    this.roomId = roomId;
    this.host = host;
    this.title = title;
    this.members = [];
  }
}
