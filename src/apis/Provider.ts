import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api';

export const getProviderApplyList = (params: AnyObj) => GET(`${API_BASE_URL}/provider/getApplyList`, params);

export const passApply = (uid: number) => POST(`${API_BASE_URL}/provider/pass-apply`, {uid});
