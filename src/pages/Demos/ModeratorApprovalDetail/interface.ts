import type { ColumnType } from "antd/lib/table";
import type { ApprovalStatus } from "../ModeratorApproval/interface";

// 由后端api返回的结构决定
export interface Detail {
  id: number
  title: string
  puname: string
  puid: number
  topicName: string
  createDt: string
  accuracy: string
  applyQuestionnaire: Question[]
  reason: string
  regDate: string
  postRecord: string
  replyRecord: string
  prestige: string
  rejectReason: string
  topicId: number
  roles: Role[]
  status: ApprovalStatus
  opPuid: number
  roleId: number
}

// 由后端api返回的结构决定
export interface Question {
  questionId: number
  answer: string
  question: string
}

// 由后端api返回的结构决定
export interface Role {
  id?: string,
  name?: string,
  topic_ids?: number[]
}

export interface SuperColumn extends ColumnType<Detail> {
  hidden?: boolean
}

// 由后端api返回的结构决定
export interface AfUser {
  id: number
  name: string
  real_name: string
}

// 由后端api返回的结构决定
export interface RoleAuth {
  id: number
  name: string
}

// 由后端api返回的结构决定
export interface ApplyForm {
  puname: string
  puid: number
  bind_af_user?: number
  roles: Role[]
  remark: string
}
