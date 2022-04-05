import type { PaginationProps } from 'antd/es/pagination';
import React, { memo, useEffect, useState } from 'react'
import { Button, Form, Input, InputRef, message, Select, Space, Table } from 'antd'
import { debounce } from 'lodash-es'
import * as API from '@/apis/User'
import { Discuss, SavedUserResult, UserRole } from '@/model';

export interface SearchParams extends Partial<Pick<SavedUserResult, 'name' | 'uid' | 'github' | 'role' | 'type'>> {
  
}

const defaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const DiscussEdit = () => {
  const [form] = Form.useForm<SearchParams>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SavedUserResult[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>(() => defaultPagination);

  const handleSearch = debounce((pagination: PaginationProps = defaultPagination) => {
    setIsLoading(true);

    form.validateFields().then(values => {
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key as keyof typeof values];
          if (key === 'role' && value === 'all') {
            (values as any)[key] = undefined as any;
          } else if (value === '' || value === null) {
            (values as any)[key] = undefined as any;
          }
        }
      }
      API.getUserList(values).then(res => {
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

  const handleEditUserInfo = (params: Partial<Omit<SearchParams, 'uid'>>) => {
    message.info('功能尚未开放');
    // API.deleteDiscuss(id)
    //   .then(res => {
    //     if (res.code === 1 && res.data === 1) {
    //       message.success('操作成功');
    //       return;
    //     }
    //     throw new Error('操作失败');
    //   })
    //   .catch(() => message.warn('操作失败'))
    //   .finally(handleReset);
  }

  return (
    <div>
      <Form form={form} layout='inline' initialValues={{ role: 'all' }}>
        <Form.Item name='uid' label='uid' style={{ width: 130 }}>
          <Input
            placeholder='请输入uid'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='name' label='用户名(模糊查询)' style={{ width: 240 }}>
          <Input
            placeholder='请输入用户名'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='github' label='github账号(模糊查询)' style={{ width: 300 }}>
          <Input
            placeholder='请输入github账号'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='role' label='权限' style={{ width: 200 }}>
          <Select
            placeholder='请选择权限'
          >
            <Select.Option value='all'>全部</Select.Option>
            <Select.Option value='common'>普通用户</Select.Option>
            <Select.Option value='provider'>贡献者</Select.Option>
            <Select.Option value='admin'>管理员</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space size={10}>
            <Button type='primary' onClick={() => handleSearch()} loading={isLoading}>搜索</Button>
            <Button type='default' onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <br />

      <Table<SavedUserResult>
        rowKey='id'
        dataSource={dataSource}
        columns={[
          { title: 'uid', dataIndex: 'uid', },
          { title: 'name', dataIndex: 'name' },
          { title: '权限', dataIndex: 'role', render: getRoleText },
          { title: 'github', dataIndex: 'github账号', render: (github) => github || '用户尚未绑定' },
          {
            title: '操作',
            render(_, record) {
              const inputRef = React.createRef<InputRef>();
              return (
                <Space size={20}>
                  <Input ref={inputRef} defaultValue={record.name} placeholder='请输入修改后的用户名' style={{width: 160}} />
                  <Button onClick={() => {
                    const newName = inputRef.current?.input?.value;
                    if (!newName) {
                      message.warn('请输入修改后的用户名');
                      return;
                    }
                    handleEditUserInfo({
                      name: newName,
                    });
                  }}>
                    编辑用户名
                  </Button>
                </Space>
              );
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

export default memo(DiscussEdit);

function getRoleText(role: UserRole) {
  switch (role as string) {
    case UserRole.COMMON:
      return '普通用户';
    case UserRole.PROVIDER:
      return '贡献者';
    case UserRole.ADMIN:
      return '管理员';
    default:
      return role;
  }
}
