export type Role = 'ADMIN' | '';

export interface TokenPayload {
  id: string;
  email: string;
  nickname: string;
}

export interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  socketId?: string;
  rooms?: Room[];
  updateDate?: Date;
  createdDate?: Date;
}
