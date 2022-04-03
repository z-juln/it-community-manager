import type { ColumnType } from "antd/lib/table"

export interface QueryParams {
  startTime: string,
  endTime: string,
}

export interface TableRecord {
  businessLine: string
  topicCateName: string
  topicCate: number | null
  reportCount: number
  readCount: number
  frontCount: number
  selfSeeCount: number
  deleteCount: number
  stepSealCount: number
  banCount: number
  unHandleCount: number
}

export type TableData = TableRecord[]

export type InnerColumnType = ColumnType<TableRecord>
