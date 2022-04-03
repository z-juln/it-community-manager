import React, { useState } from 'react'
import { Input, message, ModalProps } from 'antd'
import { Modal } from 'antd'
import { TableRecord } from '../../interface'
import { ApprovalStatus } from '../../approvalStatus'
import { EDITION_APPROVAL_REJECT_PROPOSAL } from '@/apis/EditionApproval'

interface RejectModalProps extends ModalProps {
  approvalStatus: ApprovalStatus
  data: TableRecord | null
  onClose: () => unknown
}

const RejectModal: React.FC<RejectModalProps> = ({
  approvalStatus,
  data: _data,
  onOk,
  onClose,
  ...props
}) => {
  if(_data === null) return <></>

  const [data, setData] = useState({..._data})

  const setReason = (reason: string) => {
    setData(data => ({...data, rejectReason: reason}))
  }

  const reject = () => {
    const params = {
      id: data.id,
      status: approvalStatus,
      rejectReason: data.rejectReason || ''
    }
    // post /handle-proposal query
    EDITION_APPROVAL_REJECT_PROPOSAL(params)
      .then((res: InnerResponse) => {
        if (res.success) {
          message.success('操作成功')
        } else {
          // TODO api未确定，操作失败有没有errorMsg，需不需要手动message.error('操作失败')
          message.error('操作失败')
        }
      })
  }

  return (
    <Modal
      {...props}
      title="审批不通过"
      destroyOnClose
      onOk={e => {
        onOk?.(e)
        reject()
        onClose()
      }}
      onCancel={onClose}
    >
      <p>请填写理由：</p>
      <p>
        <Input.TextArea
          rows={5}
          value={data.reason}
          onChange={e => setReason(e.target.value)}
        />
      </p>
    </Modal>
  )
}

export default RejectModal
