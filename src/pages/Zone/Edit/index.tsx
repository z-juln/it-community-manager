import React, { memo, useEffect, useState } from 'react'
import type { PaginationProps } from 'antd/es/pagination';
import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import { debounce } from 'lodash-es'
import * as apis from '@/apis/Zone'
import { Zone } from '@/model';

export interface SearchParams extends Partial<Zone> {
  
}

const defaultPagination: PaginationProps = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const ZoneEdit = () => {
  const [form] = Form.useForm<SearchParams>();
  const [addZoneForm] = Form.useForm<{ name: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addZoneLoading, setAddZoneLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Zone[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>(() => defaultPagination);
  const [addZoneModalVisible, setAddZoneModalVisible] = useState(false);

  const handleSearch = debounce((pagination: PaginationProps = defaultPagination) => {
    setIsLoading(true);

    form.validateFields().then(values => {
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key as keyof typeof values];
          if (value === '' || value === null) {
            (values as any)[key] = undefined as any;
          }
        }
      }
      apis.getZoneList(values).then(res => {
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

  function handleAddZone() {
    addZoneForm.validateFields()
      .then(values => {
        setAddZoneLoading(true);
        apis.addZone(values.name)
          .then(({ code }) => {
            if (code !== 1) {
              throw new Error('??????????????????');
            }
            setAddZoneModalVisible(false);
            handleReset();
          })
          .catch(() => {
            message.error('??????????????????');
          })
          .finally(() => {
            setAddZoneLoading(false);
          });
      })
  }

  return (
    <div>
      <Form form={form} layout='inline'>
        <Form.Item name='id' label='id' style={{ width: 130 }}>
          <Input
            placeholder='?????????id'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item name='name' label='?????????(????????????)' style={{ width: 240 }}>
          <Input
            placeholder='??????????????????'
            allowClear
            onPressEnter={() => handleSearch()}
          />
        </Form.Item>
        <Form.Item>
          <Space size={10}>
            <Button type='primary' onClick={() => handleSearch()} loading={isLoading}>??????</Button>
            <Button type='default' onClick={handleReset}>??????</Button>
          </Space>
        </Form.Item>
      </Form>

      <br />

      <Button
        onClick={() => setAddZoneModalVisible(true)}
        style={{ display: 'block', marginLeft: 'auto' }}
      >
        ????????????
      </Button>

      <br />

      <Table<Zone>
        rowKey='id'
        dataSource={dataSource}
        columns={[
          { title: 'id', dataIndex: 'id', },
          { title: '?????????', dataIndex: 'name' },
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


    <Modal
      title="????????????"
      destroyOnClose
      onOk={handleAddZone}
      onCancel={() => setAddZoneModalVisible(false)}
      visible={addZoneModalVisible}
      confirmLoading={addZoneLoading}
    >
      <Form form={addZoneForm}>
        <Form.Item name="name" label="?????????" rules={[{required: true, message: '??????????????????'}]}>
          <Input placeholder='??????????????????' />
        </Form.Item>
      </Form>
    </Modal>
    </div>
  )
}

export default memo(ZoneEdit);
