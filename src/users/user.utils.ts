import { User } from './user.entity';

export const userInfoFactory = (user: User, token = null): UserInfo => {
  const userInfo: UserInfo = {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  if (token) userInfo.token = token;
  if (user.updateDate) userInfo.updateDate = user.updateDate;
  if (user.createdDate) userInfo.createdDate = user.createdDate;
  if (user.rooms) userInfo.rooms = user.rooms;

  return userInfo;
};
