import { GET, POST } from '@/utils/request'

const API_BASE_URL = '/api'

// 版主审批页-获取列表数据
export const MODERATOR_APPROVAL_GET_TABLE_DATA = (params: AnyObj) => POST(`${API_BASE_URL}/moderatorManage/moderatorApproval/list`, params)
// 版主审批页-获取专区树
export const MODERATOR_APPROVAL_GET_TOPICS = () => GET(`${API_BASE_URL}/user/topicList`)

// 版主审批详情页-获取声望
export const MODERATOR_APPROVAL_DETAIL_GET_PRESTIGE = (params: { puid: string }) => GET(`${API_BASE_URL}/bbsuser/getPrestige`, params)

// 版主审批详情页-获取专区树
export const MODERATOR_APPROVAL_DETAIL_GET_TOPICS = MODERATOR_APPROVAL_GET_TOPICS

// 版主审批详情页-获取权限组
export const MODERATOR_APPROVAL_DETAIL_GET_ROLL = () => GET(`${API_BASE_URL}/user/role/all`)

// 版主审批详情页-获取默认选择的阿福用户
export const MODERATOR_APPROVAL_DETAIL_GET_DEFAULT_AF_USER = (puid: string) => GET(`${API_BASE_URL}/afuser/get-af-user`, { puid })

// 版主审批详情页-查询匹配名字的阿福用户列表
export const MODERATOR_APPROVAL_DETAIL_QUERY_AF_USERS = (params: { name: string }) => GET(`${API_BASE_URL}/afuser/query-af-user`, params)

// 版主审批详情页-通过审批
export const MODERATOR_APPROVAL_DETAIL_HANDLE_APPLICATION = (params: AnyObj) => POST(`${API_BASE_URL}/moderatorManage/moderatorApproval/handle`, params)

// 版主审批详情页-不通过审批
export const MODERATOR_APPROVAL_DETAIL_HANDLE_NOT_APPLICATION = (params: AnyObj) => POST(`${API_BASE_URL}/moderatorManage/moderatorApproval/handle`, params)

export default {
  MODERATOR_APPROVAL_DETAIL_GET_DEFAULT_AF_USER,
  MODERATOR_APPROVAL_DETAIL_QUERY_AF_USERS,
  MODERATOR_APPROVAL_GET_TABLE_DATA,
  MODERATOR_APPROVAL_GET_TOPICS,
  MODERATOR_APPROVAL_DETAIL_GET_PRESTIGE,
  MODERATOR_APPROVAL_DETAIL_GET_TOPICS,
  MODERATOR_APPROVAL_DETAIL_GET_ROLL,
  MODERATOR_APPROVAL_DETAIL_HANDLE_APPLICATION,
  MODERATOR_APPROVAL_DETAIL_HANDLE_NOT_APPLICATION,
}
