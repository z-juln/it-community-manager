import type { ColumnWithTab } from '@/utils/columnsWithTab';
import type { TagProps } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import type moment from 'moment';
import { ApprovalStatus } from './approvalStatus';

// 任务状态按钮 => ant-tag的color
export const statusTagColor: Partial<Record<ApprovalStatus, TagProps['color']>> = {
  [ApprovalStatus.WAITING]: "warning",
  [ApprovalStatus.PASSED]: "success",
  [ApprovalStatus.REJECTED]: "red",
}

export interface TableRecord {
  adviseReason: string
  applierName: string
  content: string
  createDt: string
  feedback: unknown | null
  header: string
  id: string
  opPuid: number
  opType: string
  opTypeDesc: string
  operator: string
  operatorPuid: number
  processFailReason: string | null
  processParam: string
  puid: number
  puname: string
  reason: string
  regDate: string
  rejectReason: string | null
  remark: string | null
  replyContent: string
  status: number
  statusDesc: string
  targetName: string
  targetPid: number
  targetPuid: number
  targetPuname: string
  targetTCreateDt: string
  targetTTitle: string
  targetTid: number
  threadTitle: string
  title: string
  topicId: number
  topicName: string
  updateDt: string
}

export interface SearchFormData {
  apply_time: [moment.Moment, moment.Moment]
  handle_time?: [moment.Moment, moment.Moment]
  [prop: string]: unknown
}

export interface SearchQueryParams {
  status: ApprovalStatus
  apply_start_time: string
  apply_end_time: string
  // handle_start_time?: string
  // handle_end_time?: string
  page_index: number
  page_size: number
  puid?: number
  targetPuid?: number
  [prop: string]: unknown
}

export interface SearchResult {
  data: TableRecord[]
  total: number
  totalNoTimeLimit: number // TodoNum
}

export type InnerColumn = ColumnType<TableRecord>

export type InnerSuperColumn = ColumnWithTab<TableRecord, ApprovalStatus> & { dataIndex?: keyof TableRecord }

// 需要弹出表单进行填写的任务类型
export enum StrictOpType {
  建议删除回帖 = '0601',
  建议封禁回帖用户 = '0609',
  建议封禁主贴用户 = '0601',
}
