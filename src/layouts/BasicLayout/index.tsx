import React, { memo, Suspense, useContext, useMemo, useState } from 'react';
import type { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import type { IUserInfo } from './components';
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import { useHistory, useLocation } from 'react-router';
import { RightContent } from './components'
import './index.less'
import SwitchPage from '../SwitchPage';
import RoutesContext from '@/routes/context';
import useInitRoutes from '@/routes/actions/useInitRoutes';
import { useMount, useUserInfo } from '@/utils/custom-hooks';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import allRoutes from '@/routes/initRoutes.config';

const LayoutConfig: ProLayoutProps = {
  title: '后台管理',
  fixedHeader: true,
  fixSiderbar: true,
  siderWidth: 188,
  headerHeight: 60,
  navTheme: 'light',
  collapsedButtonRender: false,
  menu: { locale: false, defaultOpenAll: true },
  pageTitleRender: false,
} as const

const BasicLayout = () => {
  const hitstory = useHistory()
  const { pathname } = useLocation()
  const { routes, loading } = useContext(RoutesContext)
  const [userInfo] = useUserInfo()

  const initRoutes = useInitRoutes()
  useMount(initRoutes)

  const [collapsed, setCollapsed] = useState<boolean>(false)

  return (
    <ProLayout
      className='bbs-banwu-basic-layout'
      location={{ pathname }}
      {...LayoutConfig}
      loading={loading}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      rightContentRender={() => <RightContent userInfo={userInfo} />}
      style={{
        height: '100vh',
        overflowY: 'auto'
      }}
      menuItemRender={(item, dom) => (
        <a onClick={() => hitstory.replace(item.path || '/')}>
          {dom}
        </a>
      )}
      menuContentRender={(_, dom) =>
        loading ? (
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <Spin tip="菜单加载中" />
          </div>
        ) : (
          dom
        )
      }
      menuDataRender={() => routes}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers
      ]}
      headerContentRender={() => {
        return (
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              cursor: 'pointer',
              fontSize: 18,
              width: 50
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        );
      }}
    >
      <PageContainer>
        <div style={{ minHeight: 'calc(100vh - 110px)' }}>
        <Suspense
          fallback={(
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
              <Spin tip="页面加载中" />
            </div>
          )}
        >
          <SwitchPage routes={routes} />
        </Suspense>
        </div>
      </PageContainer>
    </ProLayout>
  );
};

export default memo(BasicLayout)
