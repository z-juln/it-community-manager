import { GET, POST } from '@/utils/request'

// 版务审批页-获取列表数据
export const EDITION_APPROVAL_GET_TABLE_DATA = (params: AnyObj) => GET('/list-application', params)

// 版务审批页-获取任务标题列表
export const EDITION_APPROVAL_GET_TITILE_LIST = () => GET('/op-type')

// 版务审批页-通过申请
export const EDITION_APPROVAL_PASS_PROPOSAL = (params: AnyObj) => GET('/handle-proposal')

// 版务审批页-拒绝申请
export const EDITION_APPROVAL_REJECT_PROPOSAL = (params: { id: string, status: number, rejectReason: string }) => GET('/handle-proposal')

export default {
  EDITION_APPROVAL_GET_TABLE_DATA,
  EDITION_APPROVAL_GET_TITILE_LIST,
  EDITION_APPROVAL_PASS_PROPOSAL,
  EDITION_APPROVAL_REJECT_PROPOSAL,
}
