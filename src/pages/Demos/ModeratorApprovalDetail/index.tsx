import React, { useEffect, useState } from 'react';
import { Input, Button, message, Form, Modal, Select } from 'antd';
import ModalWithLoading from '@/components/ModalWithLoading';
import { PlusOutlined, MinusCircleOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import './index.less';
import { ApprovalStatus } from '../ModeratorApproval/interface';
import { useMount } from '@/utils/custom-hooks';
import { useHistory } from 'react-router';
import ZoomTreeSelect from '@/components/ZoomTreeSelect';
import {
  MODERATOR_APPROVAL_DETAIL_GET_DEFAULT_AF_USER,
  MODERATOR_APPROVAL_DETAIL_GET_PRESTIGE,
  MODERATOR_APPROVAL_DETAIL_QUERY_AF_USERS,
  MODERATOR_APPROVAL_DETAIL_GET_ROLL,
  MODERATOR_APPROVAL_DETAIL_HANDLE_APPLICATION,
  MODERATOR_APPROVAL_DETAIL_HANDLE_NOT_APPLICATION,
} from '@/apis/moderatorApproval';
import type { AfUser, ApplyForm, Detail, Role, RoleAuth, SuperColumn } from './interface';
import { debounce } from 'lodash-es';
const { Option } = Select;

const formItemLayoutSmall = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

/**
 * 版主+版务审批详情
 */
const ModeratorApprovalDetail: React.FC = () => {
  const history = useHistory();
  const [columns, setColumns] = useState<SuperColumn[]>([]);
  const [initialAdoptForm, setInitialAdoptForm] = useState<Partial<ApplyForm>>({});
  const [loading, setLoading] = useState(false);
  const [applyFormLoading, setApplyFormLoading] = useState(false);
  const [adoptModal, setAdoptModal] = useState(false);
  const [notAdoptModal, setNotAdoptModal] = useState(false);
  const [notAdoptReason, setNotAdoptReason] = useState('');
  const [data, setData] = useState<Partial<Detail>>({});
  const [questionModal, setQuestionModal] = useState(false);
  const [afUserList, setAfUserList] = useState<AfUser[]>([]);
  const [roleAuthList, setRoleAuthList] = useState<RoleAuth[]>([]);
  const [originRoleAuthList, setOriginRoleAuthList] = useState<Role[]>([]);
  const [form] = Form.useForm<ApplyForm>();

  useMount(async () => {
    const detail: Detail = JSON.parse(localStorage.getItem('moderator-approval-detail') || '{}');
    setData(detail);

    const prestige = await getPrestige(detail.puid);
    if (prestige) {
      detail.prestige = prestige;
    }
    initColumns(detail);

    let formData: Partial<ApplyForm> = {
      puid: detail.puid,
      puname: detail.puname,
      roles: [
        { topic_ids: [detail.topicId] }
      ],
      remark: '',
    }

    const initialInfoOfDefaultAfUser = await getInitialInfoOfDefaultAfUser(String(detail.puid))
    if (initialInfoOfDefaultAfUser) {
      const { afUserOptions, formData: newFormData } = initialInfoOfDefaultAfUser
      setAfUserList(afUserOptions)
      formData = mergeFormData(true, formData, newFormData)
    }
    setInitialAdoptForm(formData)
  });

  useEffect(() => {
    if(adoptModal === true) {
      form.setFieldsValue(initialAdoptForm)
    }
  }, [initialAdoptForm, adoptModal])

  const getInitialInfoOfDefaultAfUser = async (puid: string) => {
    type Response = InnerResponse<{
      list: ({
        af_user: AfUser,
      } & Required<ApplyForm>)[]
    }>
    // {puname: 'hellowho', puid: 54742176, bind_af_user: 987, roles: [
    //   {topic_ids: Array(1), id: 1}
    // ]}
    const list = (await MODERATOR_APPROVAL_DETAIL_GET_DEFAULT_AF_USER(puid) as Response).result.list
    if (!list.length) return null
    const { af_user, bind_af_user, roles = [], remark = '' } = list[0]

    const afUserOptions: AfUser[] = [af_user]

    const formData: Partial<ApplyForm> = {
      bind_af_user,
      roles,
      remark,
    }

    return {
      afUserOptions,
      formData,
    } as const
  }

  const mergeFormData = (mergeRoles: boolean, ...formDataList: Partial<ApplyForm>[]): Partial<ApplyForm> => {
    const newFormData = formDataList.reduce<Partial<ApplyForm>>((total, current) => {
      const { roles: oldRoles = [] } = total
      const { roles: newRoles = [], ...otherData } = current
      const roles = mergeRoles ? newRoles : [...oldRoles, ...newRoles]
      
      return {
        ...total,
        ...otherData,
        roles,
      }
    }, {})
    return newFormData
  }

  const getPrestige: (puid: number) => Promise<string | null> = async (puid: number) => {
    setLoading(true);
    const res = await MODERATOR_APPROVAL_DETAIL_GET_PRESTIGE({ puid: String(puid) });
    setLoading(false);
    if (res.status === 200) {
      return res.result.prestige as string;
    } else {
      message.error(res.msg);
      return null;
    }
  };

  const approvalIsPass = (status?: ApprovalStatus) => {
    if(status || status === 0) {
      return (
        status === ApprovalStatus.STATUS_SUCCESS
        ||
        status === ApprovalStatus.STATUS_FINISH
        ||
        status === ApprovalStatus.STATUS_FAILURE
      )
    }
    return false
  }

  // 初始化表格列
  const initColumns = (detail: Detail) => {
    console.log('detail', detail);
    const applyColumns: SuperColumn[] = [
      // {
      //     key: 'title',
      //     title: '任务标题',
      //     value: detail.title
      // },
      {
        key: 'puname',
        title: '申请人',
        render: () => detail.puname,
      },
      // {
      //     key: 'puid',
      //     title: 'puid',
      //     value: detail.puid
      // },
      {
        key: 'topicName',
        title: '申请专区',
        render: () => detail.topicName,
      },
      {
        key: 'createDt',
        title: '发起时间',
        render: () => detail.createDt,
      },
      // {
      //     key: 'accuracy',
      //     title: '答题标准率',
      //     render: () => detail.accuracy
      // },
      {
        key: 'accuracy',
        title: '答题',
        render: () => {
          return (
            <div>
              {Boolean(
                Array.isArray(detail?.applyQuestionnaire) && detail?.applyQuestionnaire?.length,
              ) && (
                <span
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                  }}
                  onClick={() => setQuestionModal(true)}
                >
                  点击查看
                </span>
              )}
            </div>
          );
        },
      },
      // {
      //     key: 'reason',
      //     title: '申请理由',
      //     render: () => detail.reason
      // },
      {
        key: 'regDate',
        title: '注册时间',
        render: () => detail.regDate,
      },
      {
        title: '发帖记录',
        key: 'postRecord',
        render: () => {
          return (
            <div>
              <a href={detail.postRecord} target={'_blank'}>
                点击查看
              </a>
            </div>
          );
        },
      },
      {
        title: '回帖记录',
        key: 'replyRecord',
        render: () => {
          return (
            <div>
              <a href={detail.replyRecord} target={'_blank'}>
                点击查看
              </a>
            </div>
          );
        },
      },
      {
        title: '声望值',
        key: 'prestige',
        render: () => detail.prestige,
      },
      {
        title: '未通过理由',
        key: 'rejectReason',
        hidden: detail.status !== ApprovalStatus.STATUS_FAIL,
        render: () => detail.rejectReason,
      },
    ];

    setColumns(applyColumns);
  };

  const openAdopt = async () => {
    console.log('版主通过审批');
    if(roleAuthList.length === 0) {
      initRoleAuthList();
    }

    setAdoptModal(true);
  };

  // 获取权限组
  const initRoleAuthList = () => {
    setApplyFormLoading(true)
    MODERATOR_APPROVAL_DETAIL_GET_ROLL()
      .then((res) => {
        if (res.status === 200) {
          console.log('权限');
          console.log(res.result);
          setRoleAuthList(res.result);
        } else {
          message.error(res.msg);
        }
      })
      .finally(() => setApplyFormLoading(false))
  };

  // 获取阿福用户列表
  const getAfuserList = debounce((value: string) => {
    MODERATOR_APPROVAL_DETAIL_QUERY_AF_USERS({ name: value })
      .then((res: InnerResponse<{list: AfUser[]}>) => {
        if (
          res.status === 200
          || (res as any).code === 200 // 兼容后端，等后端改成status就可以去掉
        ) {
          console.log('af-users: ', res.result?.list || [])
          setAfUserList(res.result?.list || []);
        } else {
          message.error(res.msg);
        }
      });
  }, 200);

  // 处理提交参数
  const formatSubmitParams = (params: ApplyForm) => {
    console.log('roleAuthList: ', roleAuthList)
    console.log('roles: ', params.roles)
    const result = { ...params };
    result.roles = result.roles
      .filter(item => roleAuthList.some(u => String(u.id) === String(item.id)))
      .map(item => ({
        ...item,
        name: roleAuthList.find(u => String(u.id) === item.id)?.name || '',
        topic_ids: item.topic_ids?.map(u => (Number(u) < 0 ? -Number(u) : u)),
      }));
    return result;
  };

  const goBack = () => history.push('/approval/moderatorApproval');

  // 原来 MODERATORADD  接口确认 不需要调用了
  const adoptHandleOk = () => {
    form.validateFields().then((values) => {
      const resultData = formatSubmitParams(values);
      const { bind_af_user, remark, ...otherValues } = resultData;
      const { id, opPuid, roleId } = data;
      const afOutUserInfo = {
        bindAfUser: resultData.bind_af_user,
        remark: resultData.remark,
        ...otherValues,
      };
      const params = {
        afOutUserInfo,
        id,
        opPuid,
        roleId,
        status: ApprovalStatus.STATUS_FINISH,
      };

      // console.log('params: ', params)
      // return
      
      MODERATOR_APPROVAL_DETAIL_HANDLE_APPLICATION(params).then(res => {
        if (res.status === 200) {
          message.success('审批成功');
          goBack();
        } else {
          message.error(res.msg);
        }
      });
    });
  };

  const notAdoptHandleOk = () => {
    const params = {
      id: data.id,
      status: ApprovalStatus.STATUS_FAIL,
      rejectReason: notAdoptReason,
    };
    MODERATOR_APPROVAL_DETAIL_HANDLE_NOT_APPLICATION(params).then((res) => {
      if (res.status === 200) {
        message.success('操作成功');
        goBack();
      } else {
        message.error(res.msg);
      }
    });
  };

  const rolesAuthDisabled = (index: number) => {
    const formRoles = form.getFieldValue('roles');
    const curRoleId = formRoles[index]?.id;
    return originRoleAuthList.some((item) => item.id === curRoleId);
  };

  return (
    <div className="moderator-approvalDetail-page">
      {loading ? <Loading3QuartersOutlined /> : null}
      {columns
        .filter((item) => !item.hidden)
        .map((item) => (
          <div className="item" key={item.key} style={{ display: 'inlineBlock' }}>
            <div className="item-left">{item.title}：</div>
            <div className="item-right">
              {item.render ? item.render(null, {} as Detail, item.key as number) : null}
            </div>
          </div>
        ))}

      {data.status === ApprovalStatus.STATUS_WAITING && (
        <div style={{ padding: '30px 10px' }}>
          <Button type={'primary'} style={{ marginRight: '20px' }}
            onClick={openAdopt}
          >
            审批通过
          </Button>
          <Button danger style={{ marginRight: '20px' }}
            onClick={() => setNotAdoptModal(true)}
          >
            审批不通过
          </Button>
        </div>
      )}
      {data.status !== ApprovalStatus.STATUS_WAITING && (
        <div>
          <Button
            style={{ marginRight: '20px' }}
            onClick={() => history.push('/approval/moderatorApproval')}
          >
            返回
          </Button>
        </div>
      )}
      {approvalIsPass(data.status) && <div className="success" />}
      {data.status === ApprovalStatus.STATUS_FAIL && <div className="error" />}
      {/* 版主通过弹框 */}
      <ModalWithLoading
        loading={applyFormLoading}
        title="版主审批"
        destroyOnClose
        forceRender
        width={600}
        visible={adoptModal}
        maskClosable={false}
        onOk={applyFormLoading ? void 0 : adoptHandleOk}
        onCancel={applyFormLoading ? void 0 : () => setAdoptModal(false)}
      >
        <Form className="form" {...formItemLayoutSmall} form={form}>
          {/* {JSON.stringify(form.getFieldsValue(), null, 2)} */}
          <Form.Item name="puname" label="用户昵称" rules={[{ required: true }]}>
            <Input placeholder="请输入用户昵称" disabled />
          </Form.Item>
          <Form.Item name="puid" label="用户puid" rules={[{ required: true }]}>
            <Input placeholder="请输入用户puid" disabled />
          </Form.Item>
          <Form.Item name="bind_af_user" label="阿福账号">
            <Select
              showSearch
              placeholder="请选择阿福账号,若不填则绑定到审批人账号上"
              allowClear
              filterOption={false}
              notFoundContent={null}
              defaultActiveFirstOption={false}
              showArrow={false}
              onSearch={(value: string) => getAfuserList(value)}
              style={{ width: '80%' }}
            >
              {afUserList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}({item.real_name})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.List name="roles">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index1) => {
                  return (
                    <Form.Item
                      label={index1 === 0 ? '权限组' : ' '}
                      key={field.key}
                      colon={index1 === 0}
                    >
                      <Form.Item {...field} name={[field.name, 'id']}>
                        <Select
                          showSearch
                          placeholder="请选择权限组"
                          allowClear
                          filterOption={(inputValue, option) =>
                            option ? String(option.props.children).indexOf(inputValue) !== -1 : false
                          }
                          style={{ width: '80%' }}
                          // disabled={rolesAuthDisabled('', index1)}
                        >
                          {roleAuthList.map((item) => (
                            <Option key={item.id} value={item.id} label={item.name}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'topic_ids']}
                          style={{ width: '100%' }}
                        >
                          <ZoomTreeSelect maxTagCount={5} />
                        </Form.Item>
                        {fields.length > 1 && !rolesAuthDisabled(index1) ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ width: '20%' }}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  );
                })}
                <Form.Item label=" " colon={false}>
                  <Button type="dashed" onClick={() => add()} style={{ width: '80%' }}>
                    <PlusOutlined /> 添加权限组
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item name="remark" label="备注" rules={[{ required: true }]}>
            <Input.TextArea placeholder="请说明账号用途" rows={3} />
          </Form.Item>
        </Form>
      </ModalWithLoading>

      {/* 版务不通过弹框 */}
      <Modal
        title="审批不通过"
        destroyOnClose
        forceRender
        visible={notAdoptModal}
        onOk={notAdoptHandleOk}
        onCancel={() => setNotAdoptModal(false)}
      >
        <div>
          <p>请填写理由：</p>
          <p>
            <Input.TextArea
              rows={5}
              value={notAdoptReason}
              onChange={(e) => {
                setNotAdoptReason(e.target.value);
              }}
            />
          </p>
        </div>
      </Modal>
      {/* 不通过弹框 */}
      <Modal
        title="问题列表"
        destroyOnClose
        forceRender
        visible={questionModal}
        onCancel={() => setQuestionModal(false)}
        footer={null}
      >
        {data?.applyQuestionnaire?.map((item) => (
          <div key={item.questionId}>
            <p style={{ paddingBottom: '16px' }}>
              问题：
              <span dangerouslySetInnerHTML={{ __html: item.question }} />
            </p>
            <p style={{ paddingBottom: '16px' }}>回答：{item.answer}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default ModeratorApprovalDetail;
