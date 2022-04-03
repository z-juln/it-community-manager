import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api'

// 获取用户信息
export const GET_USER_INFO = (params: AnyObj) => POST(`${API_BASE_URL}/user/login`, params)

// 主回帖举报-初始化下拉选项
export const POST_REPORT_INIT_ALL_OPTIONS = () => GET(`${API_BASE_URL}/tips/mainPost/filterConfig`)
// 主回帖举报-请求数据
export const POST_REPORT_GET_TABLE_DATA = (params: AnyObj) => POST(`${API_BASE_URL}/tips/mainPost/list`, params)
// 主回帖举报-提交操作
export const POST_REPORT_OPERATE_ACTION = (params: AnyObj) => PUT(`${API_BASE_URL}/tips/mainPost/audit`, params)

// 举报人效统计-主列表
export const STATISTICS_REPORT_GET_TABLE_DATA = (params: {
  startTime: string;
  endTime: string;
}) => POST(`${API_BASE_URL}/report/reviewer/statistics`, params)
// 举报数据统计-话题分类选项
export const DATA_REPORT_INIT_CATE_OPTIONS = () => GET(`${API_BASE_URL}/config/myCateList`)
// 举报数据统计-主列表
export const DATA_REPORT_GET_TABLE_DATA = (params: AnyObj) => POST(`${API_BASE_URL}/report/cate/statistics`, params)
// 举报数据统计-副列表: 话题详情
export const DATA_REPORT_GET_PLATE_TABLE_DATA = (params: AnyObj) => POST(`${API_BASE_URL}/report/topic/statistics`, params)

//主回帖举报-替换审核结果
const POST_REPORT_PUT_HANDLE_RESULT = (params: AnyObj) => PUT('/newApi/mainPost/audit', params)

export default {
  POST_REPORT_INIT_ALL_OPTIONS,
  POST_REPORT_GET_TABLE_DATA,
  POST_REPORT_PUT_HANDLE_RESULT,
  STATISTICS_REPORT_GET_TABLE_DATA,
  DATA_REPORT_INIT_CATE_OPTIONS,
  DATA_REPORT_GET_TABLE_DATA,
  DATA_REPORT_GET_PLATE_TABLE_DATA,
}
