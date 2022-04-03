import { hexToRgba } from '@/utils/common'
import type React from 'react'

export type IAction =
  | 'DELETE' // 删除
  | 'ABUSE_DELETE' // 骂删
  | 'READ' // 忽略
  | 'STAGE_BANNED' // 阶封
  | 'BANNED' // 封禁
  | 'MUTE' // 临时禁言
  | 'BLOCK' // 自见

// 举报理由标签颜色
export const REPORT_TAGS_COLOR_ENUM: Record<string, { color: string, opacity: number }> = {
  '1': {
    color: '#aaa', // 违反法律、时政敏感
    opacity: 1,
  },
  '2': {
    color: '#aaa', // 未经许可的广告行为
    opacity: 1,
  },
  '3': {
    color: '#aaa', // 色情淫秽、血腥暴恐
    opacity: 1,
  },
  '4': {
    color: '#aaa', // 低俗谩骂、攻击引战
    opacity: 1,
  },
  '5': {
    color: '#aaa', // 造谣造假
    opacity: 1,
  },
  '6': {
    color: '#aaa',
    opacity: 1,
  },
  '7': {
    color: '#aaa',
    opacity: 1,
  },
}

// 操作标签颜色
export const POST_ACTION_TAG_COLOR_PALETTE: Record<string, {
  color: string
  opacity: number
  label: string
  style?: React.CSSProperties
}> = {
  '1': {
    color: '#8C929A',
    opacity: 1,
    label: '未阅读',
    style: {
      backgroundColor: '#EFEFEF'
    }
  },
  '2': {
    color: '#fff',
    opacity: 1,
    label: '已忽略',
    style: {
      backgroundColor: '#67c23a'
    }
  },
  '4': {
    color: '#E04443',
    opacity: 0.1,
    label: '已删除'
  },
  '5': {
    color: '#E04443',
    opacity: 0.1,
    label: '已阶封'
  },
  '9': {
    color: '#E04443',
    opacity: 0.1,
    label: '已封禁'
  },
  '7': {
    color: '#8C929A',
    opacity: 1,
    label: '已前台',
    style: {
      backgroundColor: '#EFEFEF'
    }
  },
  '8': {
    color: '#E04443',
    opacity: 0.1,
    label: '已自见',
  },
  '6': {
    color: '#E04443',
    opacity: 0.1,
    label: '已临时禁言',
  },
}

export type IActionConfig = {
  label: string
  style: React.CSSProperties
  operatorCode: {
    main: string
    reply: string
  }
  toastText: string
  mode: IAction
  statusId: string
}
// 帖子操作按钮配置
export const POST_ACTION_BUTTON_COLOR_ENUM: Record<IAction, IActionConfig> = {
  'DELETE': {
    mode: 'DELETE',
    label: '删除',
    style: {
      color: '#5F697A',
      backgroundColor: hexToRgba('#5F697A', 0.1)
    },
    operatorCode: {
      main: '0208',
      reply: '0303'
    },
    toastText: '已删除',
    statusId: '4'
  },
  'ABUSE_DELETE': {
    mode: 'ABUSE_DELETE',
    label: '骂删',
    style: {
      color: '#1DA57A',
      backgroundColor: hexToRgba('#1DA57A', 0.1)
    },
    operatorCode: {
      main: '0208',
      reply: '0303'
    },
    toastText: '已删除',
    statusId: '4'
  },
  'STAGE_BANNED': {
    mode: 'STAGE_BANNED',
    label: '阶封',
    style: {
      color: '#E6972E',
      backgroundColor: hexToRgba('#E6972E', 0.1)
    },
    operatorCode: {
      main: '0612',
      reply: '0613'
    },
    toastText: '已阶封',
    statusId: '5'
  },
  'BANNED': {
    mode: 'BANNED',
    label: '封禁',
    style: {
      color: '#E04443',
      backgroundColor: hexToRgba('#E04443', 0.1)
    },
    operatorCode: {
      main: '0632',
      reply: '0633'
    },
    toastText: '已封禁',
    statusId: '9'
  },
  'MUTE': {
    mode: 'MUTE',
    label: '临时禁言',
    style: {
      color: '#4D24DB',
      backgroundColor: hexToRgba('#4D24DB', 0.1)
    },
    operatorCode: {
      main: '0624',
      reply: '0625'
    },
    toastText: '已临时禁言',
    statusId: '6'
  },
  'BLOCK': {
    mode: 'BLOCK',
    label: '自见',
    style: {
      color: '#4677E8',
      backgroundColor: hexToRgba('#4677E8', 0.1)
    },
    operatorCode: {
      main: '0207',
      reply: '0302'
    },
    toastText: '已保持自见',
    statusId: '8'
  },
  'READ': {
    mode: 'READ',
    label: '忽略',
    style: {
      border: '1px solid #D0D0D0', color: '#5F697A',
      backgroundColor: '#fff'
    },
    operatorCode: {
      main: '1001001',
      reply: '1001002'
    },
    toastText: '已忽略',
    statusId: '2'
  },
}
