import type { FormInstance, OptionProps, DataNode } from '../../interface';
import { memo, useEffect, useState, forwardRef, useMemo } from 'react'
import { Form, Input, Select, Space, Button, DatePicker } from 'antd'
import { postOptionsState } from '@/store/post'
import { useRecoilState } from 'recoil'
import { ZoomTreeSelect, ProValueInput } from '@/components/index'
import moment from 'moment'
import { useUserInfo } from '@/utils/custom-hooks';
import './index.less'

const { RangePicker } = DatePicker

interface SearchFormProps {
  form: FormInstance
  onSearch: () => void
  onReset: () => void
  loading: boolean
}
export interface SearchFormRef {

}
type IDataDTO = {
  key: (string | number),
  value: string,
  children?: IDataDTO[],
  disabled?: boolean
}
const SelectWidth = '100%'
/** 正整数匹配 */
const POSITIVE_INTEGER_REGEXP = /\d+/g
const SearchForm = ({
  form,
  onSearch,
  onReset,
  loading,
}: SearchFormProps,
  ref?: React.Ref<SearchFormRef>
) => {
  const [allPostOptionsState] = useRecoilState(postOptionsState);
  const [userInfo] = useUserInfo()

  const [topicOptions, setTopicOptions] = useState<DataNode[]>([])

  // 格式化options
  const composeOptions = (data: IDataDTO[]): OptionProps[] => {
    return data?.map(u => ({
      label: u.value,
      value: u.key,
      disabled: u.disabled,
      children: composeOptions(u.children || [])
    })) || []
  }
  // 初始化专区
  const initTopicOptions = (data: IDataDTO[]) => {
    const result = data?.map(item1 => ({
      title: item1.value,
      // 防止和children的value冲突
      value: -item1.key,
      children: item1.children?.map(item2 => ({
        title: item2.value,
        value: item2.key,
      }))
    })) || []
    setTopicOptions(result)
  }

  useEffect(() => {
    initTopicOptions(allPostOptionsState.topicList || [])
  }, [allPostOptionsState.topicList])

  const _topicOptions = useMemo(() => {
    if (userInfo.role.has('admin')) {
      return [
        { title: '全站', value: '0' },
        ...topicOptions
      ]
    } else {
      // 普通版主不需要展示全站选项
      return topicOptions
    }
  }, [userInfo.role, topicOptions])

  return (
    <Form form={form}
      layout='inline'
      name='post-report-search-form'
      className='bbs-banwu-post-report-search-form-wrapper'
      initialValues={{
        auditStatus: '1', // 未阅读
        time: [
          moment(moment().add(-2, 'days')).startOf('day'), // 两天前
          moment().endOf('day')
        ],
      }}
    >
      <Form.Item name='reviewerId' label='处理人' style={{ flexBasis: 280 }}>
        <Select
          placeholder='请选择处理人'
          showSearch
          allowClear
          optionFilterProp='label'
          options={composeOptions(allPostOptionsState.reviewerList)}
          style={{ width: SelectWidth }}
        />
      </Form.Item>
      <Form.Item name='auditStatus' label='处理状态' style={{ flexBasis: 280 }}>
        <Select
          placeholder='请选择处理状态'
          showSearch
          allowClear
          optionFilterProp='label'
          options={composeOptions(allPostOptionsState.auditStatusList)}
          style={{ width: SelectWidth }}
        />
      </Form.Item>
      <Form.Item name='puid' label='PUID' style={{ flexBasis: 280 }}>
        <ProValueInput
          format={POSITIVE_INTEGER_REGEXP}
          placeholder='请输入puid'
          allowClear
          onPressEnter={onSearch}
        />
      </Form.Item>
      <Form.Item name='tid' label='TID' style={{ flexBasis: 280 }}>
        <ProValueInput
          format={POSITIVE_INTEGER_REGEXP}
          placeholder='请输入tid'
          allowClear
          onPressEnter={onSearch}
        />
      </Form.Item>
      <Form.Item name='title' label='标题关键词' style={{ flexBasis: 280 }}>
        <Input
          placeholder='请输入标题关键词'
          allowClear
          onPressEnter={onSearch}
        />
      </Form.Item>
      <Form.Item name='content' label='内容关键词' style={{ flexBasis: 280 }}>
        <Input
          placeholder='请输入内容关键词'
          allowClear
          onPressEnter={onSearch}
        />
      </Form.Item>
      <Form.Item name='postType' label='主回帖' style={{ flexBasis: 280 }}>
        <Select
          allowClear
          placeholder='请选择主回帖'
          options={composeOptions(allPostOptionsState.postTypeList)}
        />
      </Form.Item>
      <Form.Item name='topicId' label='专区' style={{ flexBasis: 300 }}>
        <ZoomTreeSelect
          allValue='0' // 全站对应的value
          allowClear
          maxTagCount={1}
          treeData={_topicOptions}
        />
      </Form.Item>
      <Form.Item name='time' label='举报时间' style={{ flexBasis: 450 }}
        rules={[{ required: true, message: '请选择时间' }]}
      >
        <RangePicker
          allowClear
          showTime={{
            format: 'YYYY-MM-DD hh:mm:ss',
          }}
          ranges={{
            '今天': [moment().startOf('day'), moment().endOf('day')],
            '昨天': [moment().startOf('day').subtract(1, 'day'), moment().endOf('day').subtract(1, 'day')],
            '最近3天': [moment().startOf('day').subtract(2, 'day'), moment()],
          }}
          disabledDate={(current) => current && current > moment().endOf('day')}
        />
      </Form.Item>
      <Form.Item className='operate-btn-form'>
        <Space size={30}>
          <Button type='primary' onClick={onSearch} loading={loading}>搜索</Button>
          <Button type='default' onClick={onReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default memo(
  forwardRef(SearchForm) as (
    props: SearchFormProps & { ref?: React.Ref<SearchFormRef> },
  ) => React.ReactElement
)
