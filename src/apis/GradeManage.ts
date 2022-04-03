import { GET, POST } from '@/utils/request';

const API_BASE_URL = '/api';

// 分数干预后台-搜索
export const GradeManage_Search = (params: {
  puid: string | number;
  nickname?: string;
  topicIds?: string | number;
  pageNumber: number;
  pageSize: number;
}) => POST(`${API_BASE_URL}/promotion/searchPromotionStatus`, params);

// 分数干预后台-修改分数
export const GradeManage_EditScore = (params: {
  opratorPuid: number;
  puid: number;
  topicId: number;
  newScore: number;
}) => POST(`${API_BASE_URL}/promotion/backendEditModeratorScore`, params);

export default {
  GradeManage_Search,
  GradeManage_EditScore,
};
