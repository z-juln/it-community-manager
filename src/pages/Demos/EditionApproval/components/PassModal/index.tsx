import React, { useState } from 'react'
import { ModalProps } from 'antd'
import { Modal, Form, Radio } from 'antd'
import { TableRecord } from '../../interface'
import { FormData } from './interface'
import { ReasonList } from './constants'
import { ZoomTreeSelect } from '@/components'

interface PassModalProps extends ModalProps {
  data: TableRecord | null
  onPass: (record: TableRecord) => void
  onClose: () => unknown
}

const PassModal: React.FC<PassModalProps> = ({
  data,
  onPass,
  onClose,
  ...props
}) => {
  if(data === null) return <></>

  const [form] = Form.useForm<FormData>()

  const handleClickOk = () => {
    form.validateFields()
      .then(formData => {
        onPass({
          ...data,
          ...formData
        })
        onClose()
      })
  }

  return (
    <Modal
      {...props}
      title="版务封禁"
      destroyOnClose
      onOk={handleClickOk}
      onCancel={onClose}
    >
      <Form form={form}>
        <Form.Item name="reason" label="请选择" rules={[{required: true, message: '请选择'}]}>
          <Radio.Group>
            {
              ReasonList.map(value => (
                <Radio value={value.value} style={{ display: 'block' }} key={value.value}>{value.label}</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>
          <Form.Item label="专区" name={'topic_ids'} >
            <ZoomTreeSelect />
          </Form.Item>
      </Form>
    </Modal>
  )
}

export default PassModal
