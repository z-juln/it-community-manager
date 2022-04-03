import React, { useCallback, useState } from 'react'
import { Form, Button, Table } from 'antd'
import PreviousRangePicker from '@/components/PreviousRangePicker'
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks'
import { DATA_REPORT_GET_TABLE_DATA } from '@/apis'
import { InfoCircleTwoTone } from '@ant-design/icons'
import { useHistory } from 'react-router'
import { dateFormat, initQueryParams } from './constants'
import type { InnerColumnType, TableData, TableRecord } from './interface'

export default function DataReport() {
  const checkUnMounted = useCheckUnMounted()
  const history = useHistory()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TableData>([])
  const [queryParams, setQueryParams] = useState(initQueryParams)
  
  useMount(() => {
    doSearch()
  })

  const doSearch = useCallback(() => {
    setLoading(true)
    DATA_REPORT_GET_TABLE_DATA({
      startTime: queryParams.startTime + ' 00:00:00',
      endTime: queryParams.endTime + ' 23:59:59',
    })
      .then((res: InnerResponse<TableData>) => {
        console.log('table: ', res)
        if(checkUnMounted()) return
        const list = res.result
        setTableData(list.map(item => ({...item, key: item.businessLine + item.topicCate})))
      })
      .finally(() => setLoading(false))
  }, [queryParams])

  const columns: (InnerColumnType & {dataIndex?: keyof TableRecord})[] = [
    { dataIndex: 'businessLine', title: '业务线' },
    { dataIndex: 'topicCateName', title: '话题分类' },
    { dataIndex: 'reportCount', title: '举报总数' },
    { dataIndex: 'readCount', title: '阅读数' },
    { dataIndex: 'frontCount', title: '前台数' },
    { dataIndex: 'selfSeeCount', title: '自见数' },
    { dataIndex: 'deleteCount', title: '删除数' },
    { dataIndex: 'stepSealCount', title: '阶封数' },
    { dataIndex: 'banCount', title: '临时禁言数' },
    { dataIndex: 'unHandleCount', title: '未处理数' },
    {
      title: '话题详情',
      render: (_, record: TableRecord) => (
        <Button type="link" style={{padding: 0}}
          onClick={() => (
            history.push(`/report/data/plate/${record.topicCate !== null ? record.topicCate : -1}`
          ))}
        >话题详情</Button>
      )
    }
  ]

  return (
    <>
      <Form
        form={form}
        layout="inline"
        style={{marginBottom: '20px'}}
      >
        <Form.Item label="处理时间">
          <PreviousRangePicker allowClear={false}
            beforeYesterday={true}
            format={dateFormat}
            onChange={(_, values) => setQueryParams(preState => ({
              ...preState,
              startTime: values[0],
              endTime: values[1]
            }))} />
        </Form.Item>
        <Button type="primary" loading={loading} onClick={doSearch}>搜索</Button>
      </Form>

      <div className="center-section" style={{marginBottom: '6px', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          提示: <InfoCircleTwoTone twoToneColor="#F8A200" /> 目前仅支持查询昨日及以前的数据
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
