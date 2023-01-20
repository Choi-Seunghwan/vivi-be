declare type JwtPayload = {
  email: string;
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
