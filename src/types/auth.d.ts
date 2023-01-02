declare type JwtPayload = {
  email: string;
};

declare type UserInfo = {
  id: string;
  email: string;
  nickname: string;
  updateDate?: Date;
  createdDate?: Date;
  token?: string;
  password?: string;
  rooms?: Room[];
};
