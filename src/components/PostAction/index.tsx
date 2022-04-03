import type { IActionValue } from './ActionPopover'
import React, { memo, useCallback, useMemo } from 'react'
import { Button } from 'antd'
import { debounce } from 'lodash-es'
import { POST_REPORT_OPERATE_ACTION } from '@/apis/index'
import { IAction, IActionConfig, POST_ACTION_BUTTON_COLOR_ENUM } from '@/constants/color'
import ActionPopover from './ActionPopover'
import './index.less'

interface PostActionProps<T> {
  postItem: T
  actions?: IActions
  onFinish: (mode: IAction) => void
  extParams?: AnyObj
}
type IActions = Set<IAction>
const DEFAULT_ACTIONS: IActions = new Set([
  'READ', 'BLOCK', 'ABUSE_DELETE', 'DELETE', 'MUTE', 'STAGE_BANNED', 'BANNED',
])
const PostAction = <T extends Record<string, any>>({
  postItem: { topicId, isReply },
  actions,
  onFinish,
  extParams
}: PostActionProps<T>) => {
  actions = sortedActions(actions ?? new Set([]))
  const actionList = useMemo(() => actions || DEFAULT_ACTIONS, [actions])

  // 骂删
  const handleAbuseDelete = (CONFIG: IActionConfig,) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
      reason: '1'
    }).then(() => {
      onFinish(mode)
    })
  }
  // 删除
  const handleDelete = (CONFIG: IActionConfig, values: IActionValue) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      ...values,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
    }).then(() => {
      onFinish(mode)
    })
  }
  // 阶封
  const handleStageBanned = (CONFIG: IActionConfig, values: IActionValue) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      ...values,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
      firstLevelTopicId: values.cateId,
      secondLevelTopicId: values.topicId,
      topicId: undefined,
      cateId: undefined
    }).then(() => {
      onFinish(mode)
    })
  }
  // 封禁
  const handleBanned = (CONFIG: IActionConfig) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
    }).then(() => {
      onFinish(mode)
    })
  }
  // 忽略
  const handleRead = (CONFIG: IActionConfig) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
    }).then(() => {
      onFinish(mode)
    })
  }
  // 自见
  const handleBlock = (CONFIG: IActionConfig) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
    }).then(() => {
      onFinish(mode)
    })
  }
  // 临时禁言
  const handleMute = (CONFIG: IActionConfig, values: IActionValue) => {
    const { operatorCode, mode } = CONFIG
    POST_REPORT_OPERATE_ACTION({
      ...extParams,
      ...values,
      operatorCode: operatorCode[isReply ? 'reply' : 'main'],
    }).then(() => {
      onFinish(mode)
    })
  }
  // 渲染操作按钮
  const renderActionBtn = useCallback(() => {
    const result: React.ReactNode[] = []
    actionList.forEach(type => {
      const CONFIG = POST_ACTION_BUTTON_COLOR_ENUM[type]
      const { label, style } = CONFIG
      switch (type) {
        case 'DELETE':
          result.push(
            <ActionPopover
              key={type}
              onSubmit={debounce((values) => handleDelete(CONFIG, values), 300)}
              childrenText={label}
              childrenStyle={style}
            />
          )
          break;
        case 'STAGE_BANNED':
          result.push(
            <ActionPopover
              key={type}
              showTopic
              defaultTopic={topicId}
              disabledTopicSelect
              onSubmit={debounce((values) => handleStageBanned(CONFIG, values), 300)}
              childrenText={label}
              childrenStyle={style}
            />
          )
          break;
        case 'MUTE':
          result.push(
            <ActionPopover
              key={type}
              showTopic
              defaultTopic={topicId}
              disabledTopicSelect
              onSubmit={debounce((values) => handleMute(CONFIG, values), 300)}
              childrenText={label}
              childrenStyle={style}
            />
          )
          break;
        case 'ABUSE_DELETE':
          result.push(
            <Button
              onClick={debounce(() => handleAbuseDelete(CONFIG), 300)}
              key={type}
              style={style}
            >{label}</Button>
          )
          break;
        case 'BANNED':
          result.push(
            <Button
              onClick={debounce(() => handleBanned(CONFIG), 300)}
              key={type}
              style={style}
            >{label}</Button>
          )
          break;
        case 'BLOCK':
          result.push(
            <Button
              onClick={debounce(() => handleBlock(CONFIG), 300)}
              key={type}
              style={style}
            >{label}</Button>
          )
          break;
        case 'READ':
          result.push(
            <Button
              onClick={debounce(() => handleRead(CONFIG), 300)}
              key={type}
              style={style}
            >{label}</Button>
          )
          break;
        default:
          break;
      }
    })
    return result
  }, [actionList])

  return (
    <div className='bbs-banwu-post-action-wrapper' onClick={(e) => e.stopPropagation()}>
      {renderActionBtn()}
    </div>
  )
}

export default memo(PostAction) as <T extends Record<string, any>>(props: PostActionProps<T>) => React.ReactElement

// 按钮展示排序：忽略，自见，骂删，删除，临时禁言，阶封
const sortedActions = (actions: IActions): IActions => {
  const sortMap = ['READ', 'BLOCK', 'ABUSE_DELETE', 'DELETE', 'MUTE', 'STAGE_BANNED']
  const newActions = [...actions]
  newActions.sort((a, b) => sortMap.indexOf(a) - sortMap.indexOf(b))
  return new Set(newActions)
}
