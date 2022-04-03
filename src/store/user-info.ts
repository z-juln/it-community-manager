import type React from 'react';
import { atom } from 'recoil';

export type IUserInfo = {
  /** 用户名 */
  username: string
  /** 头像 */
  avatar: string
  /** 用户puid */
  puid: string
  /** 用户权限 */
  role: Set<'banzhu' | 'admin'>
} & Record<string, any>

const DefaultUserInfo: IUserInfo = {
  username: '你的名字',
  avatar: '',
  puid: '',
  role: new Set()
}

export const userInfoState = atom({
  key: 'userInfoState',
  default: DefaultUserInfo,
})
