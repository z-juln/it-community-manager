import type { ColumnType } from "antd/lib/table";
import type { ColumnWithTab } from "../../../utils/columnsWithTab";

export enum ApprovalStatus {
  /** 全部 */
  STATUS_ALL = 0,
  /** 待审批 */
  STATUS_WAITING = 1,
  /** 审批已通过 未处理 */
  STATUS_SUCCESS = 2,
  /** 审批未通过 */
  STATUS_FAIL = 3,
  /** 审批已通过 已处理 */
  STATUS_FINISH = 4,
  /** 审批已通过 失败 */
  STATUS_FAILURE = 5,
}

export type InnerColumn = ColumnType<ApprovalRow>

export type InnerSuperColumn = ColumnWithTab<ApprovalRow, ApprovalStatus> & { dataIndex?: keyof ApprovalRow }

export interface ApprovalRow {
  title: string;
  type: number;
  puname: string;
  puid: number;
  topicName: string;
  targetTTitle: string;
  targetTid: number;
  reason: string;
  createDt: string;
  status: number;
  operator: string;
  targetPuid: number;
  targetPuname: string;
  updateDt: string;
  opType: string;
  accuracy: string;
}
