import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useHistory, useRouteMatch } from 'react-router'
import { Form, Table, Select, Button } from 'antd'
import PreviousRangePicker from '@/components/PreviousRangePicker'
import { InfoCircleTwoTone } from '@ant-design/icons'
import { DATA_REPORT_GET_PLATE_TABLE_DATA, DATA_REPORT_INIT_CATE_OPTIONS } from '@/apis'
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks'
import type { ColumnType } from 'antd/lib/table'
import { dateFormat, initalQueryParams } from './constants'
import type { QueryParams, TableRecord } from './interface'

export default function PlateDetail() {
  const checkUnMounted = useCheckUnMounted()
  const history = useHistory()
  const [queryParams, setQueryParams] = useState<Omit<QueryParams, 'firstLevelTopicId'>>(initalQueryParams)
  const routeMatch = useRouteMatch<{id?: string}>()
  const [topicId, setTopicId] = useState(Number(routeMatch.params?.id) || -1)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<TableRecord[]>([])
  const [topicOptions, setTopicOptions] = useState<{value: number, label: string}[]>([])
  
  useMount(() => {
    initCateOptions()
    doSearch()
  })

  useEffect(() => {
    history.replace({
      pathname: routeMatch.path.replace(':id', String(topicId))
    })
  }, [topicId])

  const defaultTopic = useMemo(() => (
    topicOptions.find(item => item.value === topicId)?.value
  ), [topicOptions, queryParams])

  const initCateOptions = useCallback(() => {
    interface Cate {
      cate_id: number
      name: string
    }
    DATA_REPORT_INIT_CATE_OPTIONS()
      .then((res: InnerResponse<Cate[]>) => {
        if(checkUnMounted()) return
        const list = res.result
        const topicCateOptions = list.map(({cate_id: topicId, name: topicName}) => ({value: topicId, label: topicName}))
        setTopicOptions(topicCateOptions)
      })
  }, [])

  const doSearch = useCallback(() => {
    setLoading(true)
    const newQueryParams: QueryParams = {
      firstLevelTopicId: topicId,
      startTime: queryParams.startTime + ' 00:00:00',
      endTime: queryParams.endTime + ' 23:59:59',
    }
    DATA_REPORT_GET_PLATE_TABLE_DATA(newQueryParams)
      .then((res: InnerResponse<TableRecord[]>) => {
        if(checkUnMounted()) return
        const list = res.result
        setTableData(list.map(item => ({...item, key: item.topicId})))
      })
      .finally(() => setLoading(false))
  }, [queryParams, topicId])

  const columns: (ColumnType<TableRecord> & {dataIndex?: keyof TableRecord})[] = [
    { dataIndex: 'topicName', title: '话题专区' },
    { dataIndex: 'reportCount', title: '举报总数' },
    { dataIndex: 'readCount', title: '阅读数' },
    { dataIndex: 'frontCount', title: '前台数' },
    { dataIndex: 'selfSeeCount', title: '自见数' },
    { dataIndex: 'deleteCount', title: '删除数' },
    { dataIndex: 'stepSealCount', title: '阶封数' },
    { dataIndex: 'banCount', title: '临时禁言数' },
    { dataIndex: 'unHandleCount', title: '未处理数' },
  ]

  return (
    <>
      <Form
        form={form}
        layout="inline"
        style={{marginBottom: '20px'}}
      >
        <Form.Item label="话题分类">
          <Select style={{ width: 140 }}
            // 通过key重新加载组件，避免defaultValue不会更新的bug
            key={defaultTopic} 
            loading={loading}
            defaultValue={defaultTopic}
            onChange={topicId => setTopicId(Number(topicId))}
          >
            {
              topicOptions.map(({value, label}) => (
                <Select.Option value={value} key={value}>{label}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="入库时间">
          <PreviousRangePicker showTime allowClear={false}
            beforeYesterday={true}
            format={dateFormat}
            value={[moment(queryParams.startTime, dateFormat), moment(queryParams.endTime, dateFormat)]}
            onChange={(_, values) => setQueryParams(params => ({
              ...params,
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
