import React, { useState } from 'react'
import { FormInstance, Space} from 'antd';
import { Col, DatePicker, Row, Button, Select, Form, Input } from 'antd';
import ZoomTreeSelect from '@/components/ZoomTreeSelect'
import type { Title, TitleListResult } from './interface';
import { EDITION_APPROVAL_GET_TITILE_LIST } from '@/apis/EditionApproval';
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks';
import { ApprovalStatus } from "../../approvalStatus";
import { dateFormat, timeFormat } from '../../constants';

interface SearchFormProps extends React.ComponentProps<typeof Form> {
  form: FormInstance
  status: ApprovalStatus
  onSearch: () => void
  onReset: () => void
}

export default function SearchForm({
  form,
  status,
  onSearch,
  onReset,
  ...config
}: SearchFormProps) {
  const checkUnMounted = useCheckUnMounted()

  const [titleList, setTitleList] = useState<Title[]>([])

  useMount(() => {
    initTitleList()
  })

  const initTitleList = () => {
    EDITION_APPROVAL_GET_TITILE_LIST()
      .then((res: InnerResponse<TitleListResult>) => {
        if(checkUnMounted()) return
        const {list} = res.result
        setTitleList(list)
      })
  }

  return (
    <Form
      form={form}
      {...config}
      layout="inline"
      className={`inner-search-form__wrapper ${config.className || ''}`}
    >
      <Form.Item name="apply_time" label="申请时间" style={{flexBasis: 450}}>
        <DatePicker.RangePicker
          showTime={{format: 'HH:mm:ss'}}
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item name="topic" label="专区" style={{flexBasis: 220}}>
        <ZoomTreeSelect maxTagCount={1} />
      </Form.Item>
      <Form.Item name="applierName" label="申请人昵称" style={{flexBasis: 260}}>
        <Input />
      </Form.Item>
      <Form.Item name="puid" label="申请人PUID" style={{flexBasis: 260}}>
        <Input />
      </Form.Item>
      <Form.Item name="opType" label="任务标题" style={{flexBasis: 260}}>
        <Select allowClear placeholder="请选择">
          {
            titleList.map(item => (
              <Select.Option value={item.key} key={item.key}>{item.value}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
      {/* {
        status !== ApprovalStatus.WAITING &&
          <Form.Item name="handle_time" label="处理时间TODO!!!" style={{flexBasis: 450}}>
            <DatePicker.RangePicker
              showTime={{ format: timeFormat }}
              format={dateFormat}
            />
          </Form.Item>
      } */}
      <Form.Item name="targetPuid" label="被处理人PUID" style={{flexBasis: 260}}>
        <Input />
      </Form.Item>
      <Form.Item className='inner-search-form__operate-btn-group'>
        <Button type="primary" onClick={onSearch}>查询</Button>
        <Button onClick={onReset}>重置</Button>
      </Form.Item>
    </Form>
  )
}
