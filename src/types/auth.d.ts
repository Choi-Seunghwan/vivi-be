export type Role = 'ADMIN' | '';

declare type TokenPayload = {
  id: string;
  email: string;
  nickname: string;
};

declare type UserInfo = {
  id: string;
  email: string;
  nickname: string;
  rooms?: Room[];
  updateDate?: Date;
  createdDate?: Date;
};
