declare type TokenPayload = {
  id: string;
  email: string;
  nickname: string;
};

declare type UserInfo = {
  id: string;
  email: string;
  nickname: string;
  token?: string;
  rooms?: Room[];
  updateDate?: Date;
  createdDate?: Date;
};
