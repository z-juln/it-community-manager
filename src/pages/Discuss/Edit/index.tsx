import type { PaginationProps } from 'antd/es/pagination';
import { memo, useEffect, useState } from 'react'
import { Button, Form, Input, message, Select, Space, Table } from 'antd'
import { debounce } from 'lodash-es'
import * as API from '@/apis/Discuss';
import { Discuss, SavedUserResult } from '@/model';

export interface SearchParams {
  super_id: number;
  super_type: Discuss["super_type"];
  user_id?: Discuss['user_id'];
  content?: Discuss['content'];
  type?: Discuss['type'];
  create_time?: Discuss['create_time'];
}

const defaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const DiscussEdit = () => {
  const [form] = Form.useForm<SearchParams>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Discuss[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>(() => defaultPagination);

  const handleSearch = debounce((pagination: PaginationProps = defaultPagination) => {
    setIsLoading(true);

    form.validateFields().then(values => {
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key as keyof typeof values];
          if (key === 'super_type' && value === 'all') {
            (values as any)[key] = undefined as any;
          } else if (value === '' || value === null) {
            (values as any)[key] = undefined as any;
          }
        }
      }
      API.getDiscussList(values).then(res => {
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

  const handleDeleteDiscuss = (id: number) => {
    API.deleteDiscuss(id)
      .then(res => {
        if (res.code === 1 && res.data === 1) {
          message.success('????????????');
          return;
        }
        throw new Error('????????????');
      })
      .catch(() => message.warn('????????????'))
      .finally(handleReset);
  }

  return (
    <div>
      <Form form={form} layout='inline' initialValues={{ super_type: 'all' }}>
        <Form.Item name='id' label='id' style={{ width: 130 }}>
          <Input
            placeholder='?????????id'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='user_id' label='??????id' style={{ width: 200 }}>
          <Input
            placeholder='???????????????id'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='content' label='????????????(????????????)' style={{ width: 280 }}>
          <Input
            placeholder='?????????????????????'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='super_type' label='????????????' style={{ width: 200 }}>
          <Select
            placeholder='?????????????????????'
          >
            <Select.Option value='all'>??????</Select.Option>
            <Select.Option value='zone'>????????????</Select.Option>
            <Select.Option value='set'>??????</Select.Option>
            <Select.Option value='item'>??????</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space size={10}>
            <Button type='primary' onClick={() => handleSearch()} loading={isLoading}>??????</Button>
            <Button type='default' onClick={handleReset}>??????</Button>
          </Space>
        </Form.Item>
      </Form>

      <br />

      <p style={{ color: 'gray' }}>???: ????????????????????????????????????????????????????????????</p>

      <br />

      <Table<Discuss>
        rowKey='id'
        dataSource={dataSource}
        columns={[
          { title: '', dataIndex: '', width: 120 },
          { title: 'id', dataIndex: 'id', },
          { title: '??????', dataIndex: 'userInfo', render: getUserInfo },
          { title: '????????????', dataIndex: 'super_type', render: (_, record) => getSuperTypeText(record) },
          { title: '??????', dataIndex: 'content' },
          { title: '??????', dataIndex: 'create_time' },
          {
            title: '??????',
            render(_, record) {
              return <Button onClick={() => handleDeleteDiscuss(record.id)}>??????</Button>;
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
        //   showTotal: (total) => `??? ${total} ???`,
        //   onChange: (current, pageSize) => onPaginationChange({ ...pagination, current, pageSize }),
        //   ...pagination
        // }}
      />
    </div>
  )
}

export default memo(DiscussEdit);

function getUserInfo(userInfo: SavedUserResult) {
  return `${userInfo.name} (uid: ${userInfo.uid})`;
}

function getSuperTypeText({ super_type, super_id }: Discuss) {
  let text = '';
  console.log({ super_type, super_id })
  switch (super_type as string) {
    case 'item':
      text += '??????';
      break;
    case 'set':
      text += '??????';
      break;
    case 'zone':
    case 'route':
      text += '????????????';
      break;
    default:
      text += super_type;
  }
  if (super_id !== -1) {
    text += ` (id: ${super_id})`
  }
  console.log({text})
  return text;
}
