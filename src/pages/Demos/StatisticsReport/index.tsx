import React, { useCallback, useState } from 'react'
import { Form, Button, Table } from 'antd'
import PreviousRangePicker from '@/components/PreviousRangePicker'
import {
  STATISTICS_REPORT_GET_TABLE_DATA,
} from '@/apis'
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks'
import moment from 'moment'
import { InfoCircleTwoTone } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table'
import type { QueryParams, TableRecord } from './interface'
import { dateFormat } from './constants'

const initQueryParams: QueryParams = {
  startTime: moment().startOf('days').format(dateFormat),
  endTime: moment().endOf('days').format(dateFormat)
}

export default function StatisticsReport() {
  const checkUnMounted = useCheckUnMounted()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TableRecord[]>([])
  const [queryParams, setQueryParams] = useState(initQueryParams)
  
  useMount(() => {
    doSearch()
  })

  const doSearch = useCallback(() => {
    setLoading(true)
    STATISTICS_REPORT_GET_TABLE_DATA(queryParams)
      .then((res: InnerResponse<TableRecord[]>) => {
        if(checkUnMounted()) return
        const list = res.result
        setTableData(list.map(item => ({...item, key: item.uid})))
      })
      .finally(() => setLoading(false))
  }, [queryParams])

  const columns: ColumnType<TableRecord>[] & {dataIndex?: keyof TableRecord}[] = [
    { dataIndex: 'username', title: '处理人' },
    { dataIndex: 'readCount', title: '阅读数' },
    { dataIndex: 'frontCount', title: '前台数' },
    { dataIndex: 'selfSeeCount', title: '自见数' },
    { dataIndex: 'deleteCount', title: '删除数' },
    { dataIndex: 'stepSealCount', title: '阶封数' },
    { dataIndex: 'banCount', title: '临时禁言数' },
    { dataIndex: 'operationCount', title: '总操作数' },
  ]

  return (
    <>
      <Form
        form={form}
        layout="inline"
        style={{marginBottom: '20px'}}
      >
        <Form.Item label="操作时间">
          <PreviousRangePicker showTime allowClear={false}
            format={dateFormat}
            value={[moment(queryParams.startTime, dateFormat), moment(queryParams.endTime, dateFormat)]}
            onChange={(_, values) => setQueryParams(preState => ({
              ...preState,
              startTime: values[0],
              endTime: values[1]
            }))}
          />
        </Form.Item>
        <Button type="primary" loading={loading} onClick={doSearch}>搜索</Button>
      </Form>

      <div className="center-section" style={{marginBottom: '6px', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          提示: <InfoCircleTwoTone twoToneColor="#F8A200" /> 目前仅支持查询当前小时以前的数据；如10:59，查询结果为10:00之前的数据
        </div>
        {/* TODO ExportExcelBtn */}
        {/* <ExportExcelBtn type="primary" url={''} /> */}
      </div>

      <Table
        columns={columns}
        loading={loading}
        dataSource={tableData}
        pagination={false}
        style={{paddingBottom: '20px'}}
       />
    </>
  )
}
