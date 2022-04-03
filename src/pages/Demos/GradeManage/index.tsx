import { memo, useEffect, useState } from "react"
import { Button, Form, Input, Table, message } from "antd"
import { ZoomTreeSelect } from "@/components";
import EditSection from "./components/EditSection";
import { useUserInfo } from "@/utils/custom-hooks";
import * as api from "@/apis/GradeManage";
import type { ColumnType } from "antd/es/table";
import type { RecordType } from "./interface";

const GradeManage = () => {

  const [userInfo] = useUserInfo();

  const [form] = Form.useForm<RecordType>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [dataSource, setDataSource] = useState<RecordType[]>([]);

  const updateScore = (
    {puid, topicName, topicId, oldScore, newScore}: {puid: number, topicName: string, topicId: number, oldScore: number, newScore: number}
  ) => {
    api.GradeManage_EditScore({
      opratorPuid: +userInfo.username,
      puid,
      topicId,
      newScore
    })
      .then((res: InnerResponse<boolean>) => {
        if (res.result) {
          search()
          message.success('分数修改成功')
        } else {
          message.error(res.msg)
        }
      })
  }

  const columns: ColumnType<RecordType>[] = [
    {
      title: 'puid',
      dataIndex: 'puid',
      key: 'puid',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'puid',
      align: 'center',
    },
    {
      title: '专区',
      dataIndex: 'topicName',
      key: 'puid',
      align: 'center',
    },
    {
      title: '本月当前分数',
      dataIndex: 'gradeScore',
      key: 'puid',
      align: 'center',
    },
    {
      title: '操作',
      key: 'puid',
      align: 'center',
      width: 320,
      render(_, record) {
        return (
          <EditSection
            key={`${record.puid}-${record.nickname}-${record.topicId}-${record.gradeScore}`}
            max={record.gradeScore}
            defaultValue={`${record.gradeScore ?? 0}`}
            onChange={score => updateScore({
              puid: record.puid,
              topicName: record.topicName,
              topicId: record.topicId,
              newScore: score,
              oldScore: record.gradeScore
            })}
          />
        );
      }
    },
  ]

  useEffect(() => {
    search();
  }, [pageIndex]);

  const search = () => {
    form.validateFields()
      .then(values => {
        console.log('values: ', values)
        setIsLoading(true);
        api.GradeManage_Search({
          ...values,
          pageNumber: pageIndex,
          pageSize,
        })
          .then((res: InnerResponse<{moderatorStatus?: RecordType[]}>) => {
            if (res.msg) throw new Error(res.msg);
            const dataSource = res.result?.moderatorStatus ?? [];
            const { totalRowsCount } = res.pageable!
            setDataSource(dataSource);
            setTotalCount(totalRowsCount);
          })
          .catch(err => {
            message.warning(String(err));
          })
          .finally(() => setIsLoading(false));
      });
  };

  const onReset = () => form.resetFields();

  return (
    <>
      <div className="inner-layout__screening-section">
        <Form
          form={form}
          layout='inline'
          className='inner-search-form__wrapper'
        >
          <Form.Item name='puid' label='puid' style={{flexBasis: 200}}>
            <Input />
          </Form.Item>
          <Form.Item name='nickname' label='昵称' style={{flexBasis: 200}}>
            <Input />
          </Form.Item>
          <Form.Item name='topicIds' label='专区' style={{flexBasis: 200}}>
            <ZoomTreeSelect maxTagCount={1} />
          </Form.Item>
          <Form.Item className='inner-search-form__operate-btn-group'>
            <Button type="primary" onClick={search}>查询</Button>
            <Button onClick={onReset}>重置</Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        bordered
        loading={isLoading}
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          defaultPageSize: 10,
          current: pageIndex,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '80', '100'],
          showTotal: (total) => `共 ${total} 条`,
          onChange: setPageIndex,
          onShowSizeChange: (_, pageSize) => setPageSize(pageSize),
        }}
      />
    </>
  )
}

export default memo(GradeManage)
