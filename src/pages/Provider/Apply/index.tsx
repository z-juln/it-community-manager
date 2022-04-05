import type { PaginationProps } from 'antd/es/pagination';
import { memo, useEffect, useState } from 'react'
import { Button, Form, Input, message, Select, Space, Table } from 'antd'
import { debounce } from 'lodash-es'
import * as API from '@/apis/Provider'
import { Apply } from '@/model';

export interface SearchParams {
  uid: number;
  name: string;
  status: 'watting' | 'pass';
}

const defaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const ProviderApply = () => {
  const [form] = Form.useForm<SearchParams>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Apply[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>(() => defaultPagination);

  const handleSearch = debounce((pagination: PaginationProps = defaultPagination) => {
    setIsLoading(true);

    form.validateFields().then(values => {
      if (values.name === '') {
        values.name = undefined as any;
      }
      if (values.status === 'all' as any) {
        values.status = undefined as any;
      }
      API.getProviderApplyList(values).then(res => {
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

  const handleApplyPass = (uid: number) => {
    API.passApply(uid)
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
        <Form.Item name='name' label='name' style={{ width: 160 }}>
          <Input
            placeholder='请输入name'
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

      <Table<Apply>
        rowKey='id'
        dataSource={dataSource}
        columns={[
          { title: 'uid', dataIndex: 'uid', },
          { title: 'name', dataIndex: 'status', render: (_, record) => (record.user.name)},
          { title: 'status', dataIndex: 'status', render: getStatusText},
          {
            title: '操作',
            render(_, record) {
              if (record.status === 'pass') return '-----';
              return <Button onClick={() => handleApplyPass(record.uid)}>通过申请</Button>;
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
