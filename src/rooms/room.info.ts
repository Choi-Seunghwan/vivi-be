export class RoomInfo {
  roomId: string;
  host: UserInfo;
  title: string;
  members: Map<string, RoomMember>; /** key: roomId */

  constructor({ roomId, host, title }: { roomId: string; host: UserInfo; title: string }) {
    this.roomId = roomId;
    this.host = host;
    this.title = title;
    this.members = new Map();
  }
}
