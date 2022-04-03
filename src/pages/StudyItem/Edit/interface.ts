import { IAction } from '@/constants/color';

export type { FormInstance } from 'antd/es/form';
export type { OptionProps } from 'antd/lib/select';
export type { ColumnsType } from 'antd/es/table';
export type { PaginationProps } from 'antd/es/pagination';
export type { DataNode } from 'rc-tree-select/lib/interface';

export type IDataSource = {
  id: number;
  /** 发帖人 */
  publisherName: string;
  /** 审核人 */
  assignName: string;
  publisherId: string;
  /** 标题 */
  title: string;
  /** 引用的内容 */
  quoto?: {
    content: string;
    votes: string[];
    videos: string[];
  };
  /** 举报理由 */
  tipTimes: {
    reason: string;
    num: string;
    score: string;
    reasonText: string;
  }[];
  /** 是回帖 */
  isReply: boolean;
  /** 包含投票标签 */
  isVote: boolean;
  /** 帖子id */
  tid: string;
  /** 视频列表 */
  videos: string[];
  /** 正文html */
  content: string;
  /** 回复的id */
  msgId: string;
  /** 状态code */
  statusId: string;
  /** 操作状态中文 */
  statusName: string;
  /** 话题id */
  topicId: number;
  /** 话题专区 */
  topicName: string;
  /** 发布时间 */
  publishTime: string;
  /** 举报时间 */
  createDate: string;
  /** 点亮数 */
  lightCount: number;
  /** 点灭数 */
  unLightCount: number;
  /** 按钮权限 */
  permissionCodes: IAction[];
};
