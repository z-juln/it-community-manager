import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { userInfoState, IUserInfo } from '@/store/user-info'
import { useRecoilState } from 'recoil'

export function useMount(callback: () => void) {
  useEffect(callback, []);
}

export function useUnMount(callback: () => void) {
  useEffect(() => callback, []);
}

export function useCheckUnMounted() {
  const unMountRef = useRef(false);
  useUnMount(() => (unMountRef.current = true));
  return () => unMountRef.current;
}

/**
 * 在新窗口打开新页面（不受路由模式影响）
 *
 * 用法如下
 *
 *  const openUrl = useOpenUrl();
 *
 *  openUrl('/welcome');
 */
export function useOpenUrl() {
  const { createHref } = useHistory();
  return (url: string, others?: { search?: string; hash?: string }) => {
    const targetUrl = createHref({ pathname: url, ...others });
    window.open(targetUrl);
  };
}

// 组件强制重刷
export function useForceUpdate() {
  // 通过setFoo(0)进行强刷
  const setFoo = useState(0)[1];
  return () => setFoo(0);
}

// 全局用户信息
export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)

  const updateUserInfo = useCallback((values: Partial<IUserInfo>) => {
    setUserInfo({
      ...userInfo,
      ...values
    })
  }, [])

  return [
    userInfo,
    updateUserInfo
  ] as const
}
