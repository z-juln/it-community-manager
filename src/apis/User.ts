import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api';

export const getUserList = (params: AnyObj) => GET(`${API_BASE_URL}/user/list`, params);
