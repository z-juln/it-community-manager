import { BasicLayout } from '@/layouts/index'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import { BrowserRouter as Router } from 'react-router-dom'
import { setWaterMark } from '@/utils/waterMark'
import { useEffect } from 'react';
import 'moment/dist/locale/zh-cn';
// import 'moment/locale/zh-cn'; // vite的坑，不支持umd https://github.com/vitejs/vite/issues/3755
import 'antd/dist/antd.less'
import 'viewerjs/dist/viewer.min.css'
import { RoutesContainer } from './routes/RoutesContainer';
import './App.css'
import { useUserInfo } from './utils/custom-hooks';

moment.locale('zh-cn');

function App() {
  const [userInfo] = useUserInfo()

  useEffect(() => {
    setWaterMark(`虎扑版主后台(${userInfo.username})`)
  }, [userInfo])

  return (
    <ConfigProvider
      autoInsertSpaceInButton={false}
      input={{ autoComplete: '' }}
      locale={zhCN}
    >
      <Router>
        <RoutesContainer>
          <BasicLayout />
        </RoutesContainer>
      </Router>
      <div id='water-mark' />
    </ConfigProvider>
  )
}

export default App
