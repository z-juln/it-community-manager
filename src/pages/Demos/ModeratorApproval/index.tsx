import React, { useState, useEffect, memo } from 'react';
import { Input, Table, Button, message, Form, DatePicker, Radio, Badge } from 'antd';
import moment from 'moment';
import type { ApprovalRow, InnerColumn, InnerSuperColumn } from './interface';
import { ApprovalStatus } from './interface';
import { useCheckUnMounted, useOpenUrl } from '@/utils/custom-hooks';
import { getDisplayColumns } from '../../../utils/columnsWithTab';
import { MODERATOR_APPROVAL_GET_TABLE_DATA } from '@/apis/moderatorApproval';
import ZoomTreeSelect from '@/components/ZoomTreeSelect';

export interface ModeratorApprovalProps {}
/**
 * 版主审批列表
 */
const ModeratorApproval: React.FC<ModeratorApprovalProps> = () => {
  const openUrl = useOpenUrl();
  const checkUnMounted = useCheckUnMounted();
  const [columns, setColumns] = useState<InnerColumn[]>([]);
  const [data, setData] = useState<ApprovalRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [upTableStatus, setupTableStatus] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [todoNum, setTodoNum] = useState(0);
  const [status, setStatus] = useState(ApprovalStatus.STATUS_WAITING);
  const [form] = Form.useForm();

  useEffect(() => {
    getTableData();
  }, [upTableStatus]);

  useEffect(() => {
    initColumns();
  }, [status]);

  // 初始化表格列
  const initColumns = () => {
    const columns: InnerSuperColumn[] = [
      {
        title: '任务标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        hiddenTabs: [
          ApprovalStatus.STATUS_WAITING,
          ApprovalStatus.STATUS_FINISH,
          ApprovalStatus.STATUS_SUCCESS,
          ApprovalStatus.STATUS_FAILURE,
          ApprovalStatus.STATUS_FAIL,
          ApprovalStatus.STATUS_ALL,
        ],
      },
      {
        title: '具体任务',
        align: 'left',
        hiddenTabs: [],
        render: (_, record: ApprovalRow) => {
          return (
            <div>
              <div>
                <p>申请人：{record.puname}</p>
                <p>puid：{record.puid}</p>
                <p>专区：{record.topicName}</p>
                {/*<p>答题正确率：{record.accuracy}</p>*/}
                {(record.status === ApprovalStatus.STATUS_SUCCESS ||
                  record.status === ApprovalStatus.STATUS_FAIL ||
                  record.status === ApprovalStatus.STATUS_FINISH) && (
                  <Button type="link" onClick={() => goDetail(record)}>
                    查看申请信息
                  </Button>
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: '申请时间',
        dataIndex: 'createDt',
        key: 'createDt',
        align: 'center',
        hiddenTabs: [],
      },
      {
        title: '处理时间',
        dataIndex: 'updateDt',
        key: 'updateDt',
        align: 'center',
        hiddenTabs: [ApprovalStatus.STATUS_WAITING],
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        hiddenTabs: [],
        render: (_, record: ApprovalRow) => {
          return (
            <div>
              {(() => {
                switch (record.status) {
                  case ApprovalStatus.STATUS_WAITING:
                    return <div>待审批</div>;
                  case ApprovalStatus.STATUS_SUCCESS:
                    return <div>已通过</div>;
                  case ApprovalStatus.STATUS_FAIL:
                    return <div>已拒绝</div>;
                  case ApprovalStatus.STATUS_FINISH:
                    return <div>已完成</div>;
                }
              })()}
            </div>
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        width: 120,
        hiddenTabs: [
          ApprovalStatus.STATUS_FINISH,
          ApprovalStatus.STATUS_SUCCESS,
          ApprovalStatus.STATUS_FAILURE,
          ApprovalStatus.STATUS_FAIL,
          ApprovalStatus.STATUS_FAIL,
        ],
        render: (_, record: ApprovalRow) => {
          return (
            <div>
              {record.status === ApprovalStatus.STATUS_WAITING && (
                <Button type="link" onClick={() => goDetail(record)}>
                  点击处理
                </Button>
              )}
            </div>
          );
        },
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
        key: 'operator',
        width: 120,
        hiddenTabs: [ApprovalStatus.STATUS_WAITING],
      },
    ];
    const displayColumns = getDisplayColumns(columns, status);
    setColumns(displayColumns);
  };

  // 搜索获取table数据 LISTAPPLICATION :list-application
  const getTableData = () => {
    form.validateFields().then((values) => {
      //#region 默认时间为近三个月
      const apply_end_time = values.apply_time
        ? values.apply_time[1].format('YYYY-MM-DD HH:mm:ss')
        : moment().format('YYYY-MM-DD HH:mm:ss');
      const apply_start_time = values.apply_time
        ? values.apply_time[0].format('YYYY-MM-DD HH:mm:ss')
        : moment().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss');
      const handle_start_time =
        values.handle_time && status !== ApprovalStatus.STATUS_WAITING
          ? values.handle_time[0].format('YYYY-MM-DD HH:mm:ss')
          : '';
      const handle_end_time =
        values.handle_time && status !== ApprovalStatus.STATUS_WAITING
          ? values.handle_time[1].format('YYYY-MM-DD HH:mm:ss')
          : '';
      const topic = (values.topic || []).join(',')
      const puid = +values.puid || undefined
      //#endregion 默认时间为近三个月
      const params = {
        apply_end_time,
        apply_start_time,
        handle_start_time,
        handle_end_time,
        page_index: pageIndex,
        page_size: pageSize,
        status,
        ...values,
        topic,
        puid,
        handle_time: undefined,
        apply_time: undefined,
      }
      // console.log('params: ', params);
      setIsLoading(true);
      MODERATOR_APPROVAL_GET_TABLE_DATA(params).then((res) => {
        if (checkUnMounted()) return;
        setIsLoading(false);
        if (res.status === 200) {
          // console.log('get list: ', res.result)
          setData(res.result);
          setTotalCount(res?.pageable?.totalRowsCount);

          if (status === ApprovalStatus.STATUS_WAITING) {
            setTodoNum(res?.pageable?.totalRowsCount ?? 0);
          }
        } else {
          message.error(res.msg);
        }
      });
    });
  };

  //点击处理
  const goDetail = (record: ApprovalRow) => {
    openUrl('/approval/moderatorApproval/detail');
    // 页面间的数据传递：用localStorage
    localStorage.setItem('moderator-approval-detail', JSON.stringify(record));
  };

  // 改变当前页号
  const handlePageNoChange = (pageIndex: number = 1) => {
    setPageIndex(pageIndex);
    setupTableStatus((pre) => pre + 1);
  };

  //设置tabValue
  const setTabValue = (tabKey: ApprovalStatus) => {
    setStatus(tabKey);
    handlePageNoChange(1);
  };

  return (
    <>
      <div className="inner-layout__screening-section">
        <Radio.Group
          style={{paddingBottom: '20px'}}
          value={status}
          onChange={e => setTabValue(e.target.value)}
        >
          <Radio.Button value={ApprovalStatus.STATUS_WAITING}>
            待审批
            <Badge count={todoNum} offset={[10, 0]} />
          </Radio.Button>
          <Radio.Button value={ApprovalStatus.STATUS_SUCCESS}>审批已通过</Radio.Button>
          <Radio.Button value={ApprovalStatus.STATUS_FAIL}>审批未通过</Radio.Button>
          <Radio.Button value={ApprovalStatus.STATUS_ALL}>全部</Radio.Button>
        </Radio.Group>
        <Form form={form} layout="inline" className="inner-search-form__wrapper">
          <Form.Item name="apply_time" label="申请时间" style={{flexBasis: 450}}>
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          {/* {JSON.stringify(form.getFieldValue('topic'))} */}
          <Form.Item name="topic" label="专区" style={{flexBasis: 220}}>
            <ZoomTreeSelect maxTagCount={1} />
          </Form.Item>
          <Form.Item name="name" label="申请人昵称" style={{flexBasis: 250}}>
            <Input />
          </Form.Item>
          <Form.Item name="puid" label="申请人PUID" style={{flexBasis: 250}}>
            <Input />
          </Form.Item>
          {status !== ApprovalStatus.STATUS_WAITING && (
            <Form.Item name="handle_time" label="处理时间" style={{flexBasis: 450}}>
              <DatePicker.RangePicker
                showTime={{format: 'HH:mm:ss'}}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          )}
          {status !== ApprovalStatus.STATUS_WAITING && (
            <Form.Item name="operator" label="操作人" style={{flexBasis: 250}}>
              <Input />
            </Form.Item>
          )}
          <Form.Item className="inner-search-form__operate-btn-group">
            <Button
              type="primary"
              onClick={() => {
                setPageIndex(1);
                setupTableStatus((pre) => pre + 1);
              }}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                handlePageNoChange(1);
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{color: '#A9A9A9', paddingBottom: 5, fontSize: 12}}>
        说明：不选择时间的情况下，默认为最近三个月的记录
      </div>
      <Table
        bordered
        loading={isLoading}
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          defaultPageSize: 20,
          current: pageIndex,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '80', '100'],
          showTotal: (total) => `共 ${total} 条`,
          onChange: (pageIndex) => handlePageNoChange(pageIndex),
          onShowSizeChange: (_, pageSize) => setPageSize(pageSize),
        }}
      />
    </>
  );
};

export default memo(ModeratorApproval);
