import React, { memo, useEffect, useState } from 'react'
import { Form, Button, message } from 'antd'
import StatusSelector from './components/StatusSelector'
import { EDITION_APPROVAL_GET_TABLE_DATA, EDITION_APPROVAL_PASS_PROPOSAL } from '@/apis/EditionApproval'
import { SearchQueryParams, SearchResult, TableRecord, SearchFormData, InnerSuperColumn, InnerColumn, StrictOpType} from './interface';
import { ApprovalStatus, defaultApprovalStatus } from "./approvalStatus";
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks'
import SearchForm from './components/SearchForm'
import { initialFormData, dateFormat } from './constants'
import MainTable from './components/MainTable'
import { getDisplayColumns } from '@/utils/columnsWithTab';
import { PostContent, PostTitle } from '@/components';
import StatusLabel from '@/components/StatusLabel';
import PassModal from './components/PassModal';
import RejectModal from './components/RejectModal';

function EditionApproval() {
  const checkUnMounted = useCheckUnMounted()

  const [status, setStatus] = useState(defaultApprovalStatus)
  const [todoNum, setTodoNum] = useState(0)

  const [form] = Form.useForm<SearchFormData>()

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TableRecord[]>([])
  const [columns, setColumns] = useState<InnerColumn[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 为null则关闭passModal/rejectModal
  const [passModalData, setPassModalData] = useState<TableRecord | null>(null)
  const [rejectModalData, setRejectModalData] = useState<TableRecord | null>(null)

  useMount(() => {
    initFormData()
  })

  const initFormData = () => form.setFieldsValue(initialFormData)

  useEffect(() => {
    doSearch({status, pageIndex, pageSize})
  }, [status, pageIndex, pageSize])

  const handleClickSearch = () => setPageIndex(1)

  const handleClickReset = () => {
    initFormData()
    doSearch({status, pageIndex, pageSize})
  }

  const doSearch = (
    {status, pageIndex, pageSize}: {status: ApprovalStatus, pageIndex: number, pageSize: number}
  ) => {
    // alert(JSON.stringify({status, pageIndex, pageSize}))
    const formData = form.getFieldsValue()
    const queryParams: SearchQueryParams = {
      ...formData,
      status,
      apply_start_time: formData.apply_time[0].format(dateFormat),
      apply_end_time: formData.apply_time[1].format(dateFormat),
      page_index: pageIndex,
      page_size: pageSize,
    }
    if(
      status === ApprovalStatus.WAITING &&
      formData.handle_time
    ) {
      queryParams.handle_start_time = formData.handle_time[0].format(dateFormat)
      queryParams.handle_end_time = formData.handle_time[1].format(dateFormat)
    }
    setLoading(true)
    EDITION_APPROVAL_GET_TABLE_DATA(queryParams)
      .then((res: InnerResponse<SearchResult>) => {
        console.log('res: ', res)
        if(checkUnMounted()) return
        const {
          totalNoTimeLimit: todoNum,
          data: tableData,
          total
        } = res.result
        setTodoNum(todoNum)
        setTableData(tableData)
        setTotalCount(total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initColumns()
  }, [status])

  const initColumns = () => {
    const columns: InnerSuperColumn[] = [
      {
        title: '任务标题',
        dataIndex: 'opTypeDesc',
        key: 'opTypeDesc',
        align: 'center',
        fixed: 'left',
        width: 160,
      },
      {
        title: (
          <>
            <div>[专区ID]</div>
            <div>专区名称</div>
          </>
        ),
        dataIndex: 'topicName',
        key: 'topicName',
        align: 'center',
        width: 150,
        render: (text, record) => (
          <>
            <span className="inner-text__normal-id">[{record.topicId}]</span>
            <span>{text}</span>
          </>
        )
      },
      {
        title: (
          <>
            <div>[标题TID]</div>
            <div>标题</div>
          </>
        ),
        dataIndex: 'threadTitle',
        key: 'threadTitle',
        align: 'center',
        width: 200,
        render: (_, record) => {
          return (
            record.targetTid ?
              <>
                <span className="inner-text__normal-id">[{record.targetTid}]</span>
                <PostTitle postItem={{
                  ...record,
                  title: record.title,
                  tid: record.targetTid,
                  isReply: !!record.targetPid
                }} />
              </>
              // <a
              //   style={{ color: "rgba(0,0,0,0.85)" }} target="_blank"
              //   href={`https://bbs.hupu.com/${record.targetTid}.html`}
              // >{text}</a>
              :
              '暂无'
          )
        }
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        render: (_, record) => (
          <PostContent postItem={{
            ...record,
            tid: record.targetTid,
            msgId: record.targetPid,
            content: record.content
          }} />
        )
      },
      {
        title: (
          <>
            <div>[被处理人PUID]</div>
            <div>被处理人昵称</div>
          </>
        ),
        dataIndex: 'targetPuid',
        key: 'targetPuid',
        align: 'center',
        width: 140,
        render: (text, record) => (
          <>
            <span className="inner-text__normal-id">[{text}]</span>
            <br />
            <a
              style={{color: "rgba(0,0,0,0.85)"}} target="_blank"
              href={`https://my.hupu.com/${text}`}
            >{record.targetName}</a>
          </>
        )
      },
      {
        title: '申请时间',
        dataIndex: 'createDt',
        key: 'createDt',
        align: 'center',
        width: 120,
      },
      // {
      //   title: <div style={{textAlign: "center"}}>申请理由</div>,
      //   dataIndex: 'adviseReason',
      //   key: 'adviseReason',
      //   width: 150,
      //   render: (text, record) => {
      //     return (
      //       <>
      //         <div>理由: <span style={{color: "#bbb", fontSize: "12px"}}>{text}</span></div>
      //         <div>备注: <span style={{color: "#bbb", fontSize: "12px"}}>{record.remark}</span></div>
      //       </>
      //     )
      //   }
      // },
      {
        title: (
          <>
            <div>[申请人PUID]</div>
            <div>申请人昵称</div>
          </>
        ),
        dataIndex: 'applierName',
        key: 'applierName',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <>
            <span className="inner-text__normal-id">[{record.puid}]</span>
            <br />
            <a
              style={{color: "rgba(0,0,0,0.85)"}} target="_blank"
              href={`https://my.hupu.com/${record.puid}`}
            >{text}</a>
          </>
        )
      },
      // {
      //   title: '处理时间',
      //   dataIndex: 'updateDt',
      //   key: 'updateDt',
      //   align: 'center',
      //   width: 120,
      //   hiddenTabs: [
      //     ApprovalStatus.WAITING,
      //     ApprovalStatus.REJECTED,
      //   ]
      // },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 90,
        render: status => {
          type LabelType = React.ComponentProps<typeof StatusLabel>['type']
          let labelType: LabelType = 'blue'
          let labelText = ''
          switch (status) {
            case ApprovalStatus.WAITING:
              labelType = 'blue'
              labelText = '待审批'
              break
            case ApprovalStatus.PASSED:
              labelType = 'green'
              labelText = '已通过'
              break
            case ApprovalStatus.REJECTED:
              labelType = 'pink'
              labelText = '未通过'
              break
          }
          return <StatusLabel type={labelType} text={labelText} />
        }
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        width: 100,
        hiddenTabs: [
          ApprovalStatus.WAITING,
        ],
      },
      {
        title: '操作',
        align: 'center',
        width: 220,
        fixed: "right",
        render: (_, record) => {
          switch (record.status) {
            case ApprovalStatus.WAITING:
              return (
                <div className="inner-button__pass-button-group">
                  {/* 
                    类型为建议删除回帖/建议封禁回帖用户/建议封禁主贴用户->弹窗填写信息再提交
                    其他类型->直接通过
                  */}
                  <Button
                    className="inner-button__pass-button"
                    onClick={() => handleClickPass(record)}
                  >通过</Button>
                  <Button
                    className="inner-button__reject-button"
                    onClick={() => setRejectModalData(record)}
                  >拒绝</Button>
                </div>
              )
            case ApprovalStatus.REJECTED:
              return (
                <Button className="inner-button__rejected-button">已拒绝</Button>
              )
            case ApprovalStatus.PASSED:
              return '--'
          } 
        }
      },
    ]
    const displayColumns = getDisplayColumns(columns, status)
    setColumns(displayColumns)
  }

  const handleClickPass = (record: TableRecord) => {
    const isStrictOpType = (opType: TableRecord['opType']) => !!Object.values(StrictOpType).includes(opType as StrictOpType)
    
    if(isStrictOpType(record.opType)) {
      setPassModalData(record)
    } else {
      pass(() => doSearch({status, pageIndex, pageSize}))(record)
    }
  }

  const pass = (onSuccess: () => void) => (record: TableRecord) => {
    EDITION_APPROVAL_PASS_PROPOSAL(record)
      .then((res: InnerResponse) => {
        if (res.status === 200) {
          message.success('操作成功')
          onSuccess()
        } else {
          // TODO api未确定，操作失败有没有errorMsg，需不需要手动message.error('操作失败')
          message.error(res.msg)
        }
      })
  }

  return (
    <>
      <div className="inner-layout__screening-section">
        <StatusSelector
          style={{paddingBottom: '20px'}}
          status={status} todoNum={todoNum}
          onChange={setStatus}
        />
        <SearchForm {...{form, status, onSearch: handleClickSearch, onReset: handleClickReset}} />
      </div>
      <div style={{color: '#A9A9A9', paddingBottom: 5, fontSize: 12}}>
        说明：不选择时间的情况下，默认为最近三个月的记录
      </div>
      <MainTable
        loading={loading}
        dataSource={tableData}
        columns={columns as any}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          current: pageIndex,
          total: totalCount,
          onChange: setPageIndex,
          onShowSizeChange: (pageIndex, pageSize) => {
            setPageIndex(pageIndex)
            setPageSize(pageSize)
          }
        }}
      >
        {}
      </MainTable>

      {/* Modal */}
      <PassModal
        onPass={pass(() => doSearch({status, pageIndex, pageSize}))}
        data={passModalData}
        visible={!!passModalData}
        onClose={() => setPassModalData(null)}
        confirmLoading={loading}
      />
      <RejectModal
        approvalStatus={status}
        data={rejectModalData}
        visible={!!rejectModalData}
        onOk={() => doSearch({status, pageIndex, pageSize})}
        onClose={() => setRejectModalData(null)}
        confirmLoading={loading}
      />
      {/* Modal */}
    </>
  )
}

export default memo(EditionApproval)
