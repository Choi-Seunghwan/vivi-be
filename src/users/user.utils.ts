import { User } from './user.entity';

export const userInfoFactory = (user: User): UserInfo => {
  const userInfo: UserInfo = {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  if (user.updateDate) userInfo.updateDate = user.updateDate;
  if (user.createdDate) userInfo.createdDate = user.createdDate;
  if (user.rooms) userInfo.rooms = user.rooms;

  return userInfo;
};
