import type { PaginationProps } from 'antd/es/pagination';
import { memo, useEffect, useState } from 'react'
import { Button, Form, Input, message, Select, Space, Table } from 'antd'
import { debounce } from 'lodash-es'
import * as API from '@/apis/StudyItem';
import { Apply, StudyItem } from '@/model';

export interface SearchParams extends Pick<Apply, 'uid' | 'status' | 'target_id'> {
  title: string;
}

const defaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0,
};

type DisplayDataSource = (Apply & { studyItem: StudyItem })[];

const ProviderApply = () => {
  const [form] = Form.useForm<SearchParams>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Apply[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>(() => defaultPagination);
  const [displayDataSource, setDisplayDataSource] = useState<DisplayDataSource>([]);

  useEffect(() => {
    (async () => {
      const ids = dataSource.map(item => item.target_id);
      const newDisplayDataSource: DisplayDataSource = [...dataSource] as any;
      for (let i = 0; i < newDisplayDataSource.length; i++) {
        const item = newDisplayDataSource[i];
        item.studyItem = (await API.getStudyItemInfo(item.target_id!)).data;
      }
      setDisplayDataSource(newDisplayDataSource);
    })();
  }, [dataSource]);

  const handleSearch = debounce((pagination: PaginationProps = defaultPagination) => {
    setIsLoading(true);

    form.validateFields().then(values => {
      if (values.title === '') {
        values.title = undefined as any;
      }
      if (values.status === 'all' as any) {
        values.status = undefined as any;
      }
      API.getApplyList(values).then(res => {
        setDataSource(res.data || []);
        // setPagination({
        //   ...pagination,
        //   total: res.pageable?.totalRowsCount
        // });
      }).catch(() => {
        setPagination(defaultPagination);
        setDataSource([]);
      }).finally(() => {
        setIsLoading(false);
      });
    })
  }, 300);

  const handleReset = () => {
    form.resetFields();
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleApplyPass = (id: number) => {
    API.passApply(id)
      .then(res => {
        if (res.code === 1) {
          message.success('操作成功');
          return;
        }
        throw new Error('操作失败');
      })
      .catch(() => message.warn('操作失败'))
      .finally(handleReset);
  }

  return (
    <div>
      <Form form={form} layout='inline' initialValues={{ status: 'all' }}>
        <Form.Item name='uid' label='uid' style={{ width: 130 }}>
          <Input
            placeholder='请输入uid'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='target_id' label='学点id' style={{ width: 180 }}>
          <Input
            placeholder='请输入学点id'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='title' label='标题(模糊匹配)' style={{ width: 220 }}>
          <Input
            placeholder='请输入标题'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='status' label='处理状态' style={{ width: 200 }}>
          <Select
            placeholder='请选择处理状态'
          >
            <Select.Option value='all'>全部</Select.Option>
            <Select.Option value='waitting'>申请中</Select.Option>
            <Select.Option value='pass'>申请通过</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className='operate-btn-form'>
          <Space size={10}>
            <Button type='primary' onClick={() => handleSearch()} loading={isLoading}>搜索</Button>
            <Button type='default' onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <br />

      <Table<DisplayDataSource[number]>
        rowKey='id'
        dataSource={displayDataSource}
        columns={[
          { title: 'uid', dataIndex: 'uid', },
          { title: 'id', dataIndex: 'target_id', width: 150 },
          { title: '标题', dataIndex: 'title', render: (_, record) => <a href={`http://127.0.0.1:3333/study-item/${record.target_id!}`} target='_blank'>{record.studyItem.title}</a>, },
          { title: '状态', dataIndex: 'status', render: getStatusText, },
          {
            title: '操作',
            render(_, record) {
              if (record.status === 'pass') return '-----';
              return <Button onClick={() => handleApplyPass(record.target_id!)}>通过申请</Button>;
            }
          },
        ]}
        bordered
        loading={isLoading}
        // pagination={{
        //   defaultPageSize: 20,
        //   showSizeChanger: true,
        //   showQuickJumper: true,
        //   pageSizeOptions: ['10', '20', '30', '50'],
        //   showTotal: (total) => `共 ${total} 条`,
        //   onChange: (current, pageSize) => onPaginationChange({ ...pagination, current, pageSize }),
        //   ...pagination
        // }}
      />
    </div>
  )
}

export default memo(ProviderApply)

function getStatusText(status: string) {
  switch (status) {
    case 'waitting':
      return '申请中';
    case 'pass':
      return '申请已通过';
    case 'reject':
      return '申请已拒绝';
    default:
      return status;
  }
}
