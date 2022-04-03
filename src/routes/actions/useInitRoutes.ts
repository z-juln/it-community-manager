import { useCallback, useContext } from 'react';
import RoutesContext from '../context';
import initRoutes from '../initRoutes.config';
import { useUserInfo } from '@/utils/custom-hooks';
import { GET_USER_INFO } from '@/apis/index';

const useInitRoutes = () => {
  const { setRoutes, setLoading } = useContext(RoutesContext);
  const [, updateUserInfo] = useUserInfo();

  const run = useCallback(() => {
    setLoading(true);
    GET_USER_INFO({
      name: 'admin',
      password: 'admin',
    })
      .then((res) => {
        if (res.code === 1) {
          const { uid, avatar, name } = res.data;
          setRoutes(initRoutes);

          updateUserInfo({
            puid: uid,
            avatar,
            username: name,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return run;
};

export default useInitRoutes;
