import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api';

export const getDiscussList = (params: AnyObj) => GET(`${API_BASE_URL}/discuss/list`, params);

export const deleteDiscuss = (id: number) => POST(`${API_BASE_URL}/discuss/del`, {id});
