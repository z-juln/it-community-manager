import type { IDataSource, PaginationProps } from './interface';
import { memo, useEffect, useState } from 'react'
import { Form } from 'antd'
import TableList from './components/TableList'
import SearchForm from './components/SearchForm'
import { debounce } from 'lodash-es'
import * as API from '@/apis/index'
import { postOptionsState } from '@/store/post'
import { useRecoilState } from 'recoil'
import moment from 'moment';

const DefaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0
}
const PostReport = () => {
  const [form] = Form.useForm()

  const [, setPostOptions] = useRecoilState(postOptionsState);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<IDataSource[]>([])
  const [pagination, setPagination] = useState<PaginationProps>(() => DefaultPagination)

  // Table搜索，有参数代表需要重置分页
  const handleSearch = debounce((pagination: PaginationProps = DefaultPagination) => {
    setIsLoading(true)
    form.validateFields().then(values => {
      const { time, topicId, ...restValues } = values
      const [startTime, endTime] = time ? [moment(time[0])?.format('YYYY-MM-DD HH:mm:ss'), moment(time[1])?.format('YYYY-MM-DD HH:mm:ss')] : []
      API.POST_REPORT_GET_TABLE_DATA({
        ...restValues,
        startTime,
        endTime,
        topicId: topicId?.includes('0') ? undefined : topicId,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }).then(res => {
        setDataSource(res.result || [])
        setPagination({
          ...pagination,
          total: res.pageable?.totalRowsCount
        })
      }).catch(() => {
        setPagination(DefaultPagination)
        setDataSource([])
      }).finally(() => {
        setIsLoading(false)
      })
    })
  }, 300)
  // 重置搜索
  const handleReset = () => {
    form.resetFields()
    handleSearch()
  }
  // 初始化所有options
  const initAllOptions = () => {
    API.POST_REPORT_INIT_ALL_OPTIONS().then(res => {
      setPostOptions(res.result || {})
    })
  }

  useEffect(() => {
    handleSearch()
    initAllOptions()
  }, [])

  return (
    <div className='bbs-banwu-post-report-wrapper'>
      <SearchForm
        form={form}
        onSearch={() => handleSearch()}
        onReset={handleReset}
        loading={isLoading}
      />
      <TableList
        dataSource={dataSource}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={handleSearch}
      />
    </div>
  )
}

export default memo(PostReport)
