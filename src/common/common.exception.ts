import { Exception } from './Exception';

/** socket */

export class SocketJoinFailException extends Exception {}
export class SocketLeaveFailException extends Exception {}
export class SocketLeaveHostFailException extends Exception {}

export class SocketNotInRoomException extends Exception {}
export class SocketAlreadyInRoomException extends Exception {}

/** cache */

export class CacheRoomInfoNotFoundException extends Exception {}
