import React from 'react'
import { Badge, Radio, RadioGroupProps } from 'antd'
import { ApprovalStatus } from "../../approvalStatus"

interface StatusSelectorProps extends Omit<RadioGroupProps, 'onChange'> {
  status: ApprovalStatus
  onChange: (status: ApprovalStatus) => void
  todoNum: number
}

export default function StatusSelector({
  status,
  onChange,
  todoNum,
  ...config
}: StatusSelectorProps) {
  return (
    <Radio.Group {...config} value={status} onChange={e => onChange(e.target.value)}>
      <Radio.Button value={ApprovalStatus.WAITING}>待审批<Badge count={todoNum} offset={[10, 0]} /></Radio.Button>
      <Radio.Button value={ApprovalStatus.PASSED}>审批通过</Radio.Button>
      <Radio.Button value={ApprovalStatus.REJECTED}>审批未通过</Radio.Button>
      <Radio.Button value={ApprovalStatus.ALL}>全部</Radio.Button>
    </Radio.Group>
  )
}
