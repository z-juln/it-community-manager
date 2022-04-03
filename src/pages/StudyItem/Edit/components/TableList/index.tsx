import type { ColumnsType, IDataSource, PaginationProps } from '../../interface'
import { memo, useEffect, useMemo, useState } from 'react'
import { Table, message } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { REPORT_TAGS_COLOR_ENUM, POST_ACTION_TAG_COLOR_PALETTE, IAction, POST_ACTION_BUTTON_COLOR_ENUM } from '@/constants/color'
import { PostContent, PostTitle, CustomTag, PostAction } from '@/components/index'
import moment from 'moment'
import { useUserInfo } from '@/utils/custom-hooks'
import './index.less'

interface TableListProps {
  dataSource: IDataSource[]
  loading: boolean
  pagination: PaginationProps
  onPaginationChange: (pagination: PaginationProps) => void
}
const TableList = ({
  dataSource: _dataSource,
  loading,
  pagination,
  onPaginationChange
}: TableListProps) => {
  const [columns, setColumns] = useState<ColumnsType<IDataSource>>([])
  const [dataSource, setDataSource] = useState<IDataSource[]>(_dataSource)

  const [userInfo] = useUserInfo()

  // 静默更新table数据
  const updateTableStatusSlient = (id: number, mode: IAction) => {
    const { toastText, statusId } = POST_ACTION_BUTTON_COLOR_ENUM[mode]
    message.success(toastText)
    setDataSource(list => {
      const index = list.findIndex(u => u.id === id) // 直接取index会有react.key重复的bug
      if (index === -1) return list
      const result = [...list]
      result[index] = {
        ...result[index],
        statusName: toastText,
        statusId,
        assignName: userInfo.username
      }
      return result
    })
  }

  useEffect(() => {
    setDataSource(_dataSource)
  }, [_dataSource])

  useEffect(() => {
    setColumns([
      {
        title: '被举报用户', dataIndex: 'publisherName', align: 'center', width: 120,
        render: (text: string, { publisherId }: IDataSource) => (
          <div onClick={() => window.open(`//my.hupu.com/${publisherId}`)}>
            <div className='publisher-username'>{text}</div>
            <a>[{publisherId}]</a>
            <FileTextOutlined style={{ color: '#3169E8', marginLeft: 3 }} />
          </div>
        )
      },
      { title: '专区', dataIndex: 'topicName', align: 'center', width: 100 },
      {
        title: '标题', dataIndex: 'title', align: 'center', className: 'title-cell',
        render: (_: string, record: IDataSource) => (
          <PostTitle<IDataSource> postItem={record} />
        ),
      },
      {
        title: '内容', dataIndex: 'content', align: 'center', className: 'post-content',
        render: (_: string, record: IDataSource) => (
          <PostContent<IDataSource> postItem={record} />
        )
      },
      {
        title: '举报理由/次数', dataIndex: 'tipTimes', align: 'center', className: 'tip-detail-cell', width: 130,
        render: (_, record: IDataSource) => (
          <ul style={{ minWidth: 80, maxWidth: 150 }}>
            {record.tipTimes?.map((item, index: number) => (
              <li key={index} style={{ marginBottom: 5 }}>
                <CustomTag {...REPORT_TAGS_COLOR_ENUM[item.reason]} style={{ whiteSpace: 'initial', display: 'inline' }}>{item.reasonText}</CustomTag>
                <span className='number'>*{item.num}</span>
              </li>
            ))}
          </ul>
        )
      },
      { title: '举报时间', dataIndex: 'createDate', align: 'center', width: 90, },
      {
        title: '状态', dataIndex: 'statusName', align: 'center', width: 100,
        render: (text: string, record: IDataSource) => {
          const { color, opacity, style } = POST_ACTION_TAG_COLOR_PALETTE[record.statusId] || {}
          return (
            <>
              <CustomTag
                color={color}
                opacity={opacity}
                style={style}
                icon={<i style={{ display: 'inline-block', marginRight: 3, verticalAlign: 'middle', borderRadius: '50%', width: 4, height: 4, background: color }} />}
              >
                {text}
              </CustomTag>
              {text !== '未阅读' && <div style={{ marginTop: 10 }}>{record.assignName}</div>}
            </>
          )
        }
      },
      {
        title: '操作', dataIndex: '_action', align: 'center', width: 150, fixed: 'right',
        render: (_, record: IDataSource) => (
          <PostAction<IDataSource>
            actions={new Set(record.permissionCodes)}
            postItem={record}
            onFinish={(mode: IAction) => updateTableStatusSlient(record.id, mode)}
            extParams={{
              tipMessageId: record.id,
              puid: record.publisherId,
              topicId: record.topicId,
              tid: record.tid,
              pid: record.msgId,
            }}
          />
        )
      },
    ])
  }, [dataSource, userInfo])

  return (
    <Table<IDataSource>
      className='bbs-banwu-post-report-table-wrapper'
      rowKey='id'
      dataSource={dataSource}
      columns={columns}
      bordered
      loading={loading}
      pagination={{
        defaultPageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条`,
        onChange: (current, pageSize) => onPaginationChange({ ...pagination, current, pageSize }),
        ...pagination
      }}
    />
  )
}

export default memo(TableList)
