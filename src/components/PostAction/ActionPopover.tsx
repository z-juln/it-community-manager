import type { PopoverProps } from 'antd/lib/popover'
import type { KVOption } from '@/store/post'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Popover, Radio, Button, Cascader } from 'antd'
import { postOptionsState } from '@/store/post'
import { useRecoilState } from 'recoil'
import { last } from 'lodash-es'
import './ActionPopover.less'

interface ActionPopoverProps extends PopoverProps {
  onSubmit: (values: IActionValue) => void
  showTopic?: boolean
  // 禁止修改专区
  disabledTopicSelect?: boolean
  childrenText: string
  childrenStyle: React.CSSProperties
  defaultTopic?: string
}
export type ActionPopoverRef = Record<string, unknown>
export type IActionValue = {
  reason: string,
  topicId?: string,
  cateId?: string
}
const overlayClassName = 'post-action-popover-wrapper'
const ActionPopover = ({
  showTopic,
  disabledTopicSelect,
  onSubmit,
  childrenText,
  childrenStyle,
  defaultTopic
}: ActionPopoverProps,
  ref: React.Ref<ActionPopoverRef>
) => {
  const [allPostOptionsState] = useRecoilState(postOptionsState)

  const [visible, setVisible] = useState<boolean>(false)
  const [selectedReason, setSelectedReason] = useState<string>('1')
  const [reasonList, setReasonList] = useState<SelectOption[]>([])
  const [topicOptions, setTopicOptions] = useState<SelectOption[]>([])
  const [currentTopic, setCurrentTopic] = useState<string[]>([])

  // 记录options初始状态
  const statusRef = useRef<{
    has_inited_reason: boolean
    has_inited_topic: boolean
  }>({
    has_inited_reason: false,
    has_inited_topic: false,
  })

  // 修改选中话题
  const handleChangeTopic = (value: (string | number)[]) => {
    setCurrentTopic(value as string[])
  }
  // 初始化话题列表
  const initTopicList = () => {
    const result: SelectOption[] = composeOptions(allPostOptionsState.topicList || [])
    setTopicOptions(result)
    statusRef.current.has_inited_topic = true
  }
  // 格式化options
  const composeOptions = (data: KVOption[]): SelectOption[] => {
    return data?.map(u => ({
      label: u.value,
      value: u.key,
      disabled: u.disabled,
      children: composeOptions(u.children || [])
    })) || []
  }
  // 初始化操作理由
  const initReasonList = () => {
    const result: SelectOption[] = composeOptions(allPostOptionsState.reasonList || [])
    setReasonList(result)
    statusRef.current.has_inited_reason = true
  }
  // 获取专区id
  const getCateId = (topicId?: string) => {
    let cateId
    if (topicId) {
      topicOptions.forEach(item1 => {
        item1.children?.forEach(item2 => {
          if (topicId === item2.value) {
            cateId = item1.value
          }
        })
      })
    }
    return cateId
  }
  // 提交
  const handleSubmit = () => {
    setVisible(false)
    onSubmit({
      reason: selectedReason,
      topicId: last(currentTopic),
      cateId: getCateId(last(currentTopic))
    })
  }
  // 回显选中话题
  const initTopicValue = (topic: string, options: KVOption[]) => {
    options.forEach(item1 => {
      const record = item1.children?.find(u => u.key === topic)
      if (record) {
        setCurrentTopic([item1.key, record.key] as string[])
      }
    })
  }
  // 监听点击，关闭弹框
  const handleClose = useCallback(() => {
    // const eventPath = e.path || (typeof e.composedPath === 'function' && e.composedPath()) || undefined
    // const isExist = eventPath?.some((element: Element) => !!(element?.className?.includes(overlayClassName)));
    // if (!isExist)
    setVisible(false)
  }, [])

  useEffect(() => {
    if (visible) {
      if (!statusRef.current.has_inited_reason) {
        initReasonList()
      }
      if (!statusRef.current.has_inited_topic) {
        initTopicList()
      }
    }
  }, [visible, allPostOptionsState])

  useEffect(() => {
    if (visible && defaultTopic && allPostOptionsState.topicList) {
      initTopicValue(String(defaultTopic), allPostOptionsState.topicList)
    }
  }, [visible, defaultTopic, allPostOptionsState])

  useEffect(() => {
    if (!visible) {
      setSelectedReason('1')
      setCurrentTopic([])
    }
  }, [visible])

  useEffect(() => {
    const { body } = document
    if (visible) {
      body.addEventListener('click', handleClose);
    } else {
      body.removeEventListener('click', handleClose)
    }
    return () => {
      body.removeEventListener('click', handleClose)
    }
  }, [visible])

  return (
    <Popover
      ref={ref}
      title='请选择'
      visible={visible}
      overlayClassName={overlayClassName}
      trigger={['click']}
      destroyTooltipOnHide={{ keepParent: false }}
      content={
        <div className='action-content' onClick={e => e.stopPropagation()}>
          <Radio.Group
            className='radio-list-wrapper'
            name='post-action-popover'
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            {
              reasonList.map(item => (
                <Radio key={item.key || item.value} value={item.value}>{item.label}</Radio>
              ))
            }
          </Radio.Group>
          {/* 话题选择 */}
          {
            showTopic &&
            <div className='topic-cascader-wrapper'>
              <span className='label'>话题</span>
              <Cascader
                disabled={disabledTopicSelect}
                style={{ width: 280 }}
                options={topicOptions}
                value={currentTopic}
                onChange={handleChangeTopic}
                placeholder='请选择话题'
                showSearch={{
                  filter: (inputValue, path) => path.some((option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
                }}
              />
            </div>
          }
          <div className='operate-area'>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type='primary' onClick={handleSubmit} disabled={showTopic && currentTopic.length === 0}>确定</Button>
          </div>
        </div>
      }>
      <Button
        onClick={() => setVisible(true)}
        style={childrenStyle}
      >{childrenText}</Button>
    </Popover>
  )
}

export default memo(
  React.forwardRef(ActionPopover) as (
    props: ActionPopoverProps & { ref?: React.Ref<ActionPopoverRef> },
  ) => React.ReactElement
)
