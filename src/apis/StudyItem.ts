import { Apply, Response, StudyItem } from '@/model';
import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api';


export const getStudyItemInfo = (id: string | number): Promise<Response<StudyItem>> =>
  GET(`/api/study-item/info?id=${id}`);

export const getApplyList =
  (params: Partial<Pick<Apply, 'uid' | 'status' | 'target_id'> & {title: string}>) =>
  POST(`${API_BASE_URL}/study-item/apply-list`, params);

export const passApply = (id: number) => POST(`${API_BASE_URL}/study-item/pass-apply`, { id });
