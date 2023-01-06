export class RoomInfo {
  roomId: string;
  host: RoomMember;
  title: string;
  members: object;
  /** redis string data type 에서 plainObject로 변환 됨 (Map type 사용 불가)  */
  // members: Map<string, RoomMember>; /** key: roomId */

  constructor({ roomId, host, title }: { roomId: string; host: UserInfo; title: string }) {
    this.roomId = roomId;
    this.host = host;
    this.title = title;
    this.members = {};
  }
}
