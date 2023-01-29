import { Exception } from 'src/common/exception';

export class RoomNotFoundException extends Exception {}
export class RoomStatusException extends Exception {}
export class RoomCreateFailException extends Exception {}

export class AlreadyJoinedRoomException extends Exception {}
export class SocketNotInRoomException extends Exception {}
