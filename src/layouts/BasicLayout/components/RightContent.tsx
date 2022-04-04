import { memo, useMemo, useState } from 'react'
import { Input, Avatar } from 'antd'
import { isDev } from '@/utils/env'
import { logout } from '@/utils/common'
// import SearchIcon from '@/assets/images/search.png'
import { UserOutlined } from '@ant-design/icons'
import './RightContent.less'
interface RightContentProps {
  userInfo: IUserInfo
}

export type IUserInfo = {
  username: string
  avatar: string
}

const RightContent = ({
  userInfo
}: RightContentProps) => {

  return (
    <div className='bbs-banwu-layout-header-right-content-wrapper'>
      <section className='operate-area no-split'>
        <a href='http://127.0.0.1:3333' target='_blank' className='af-out-link'>前台</a>
      </section>
      <section className='operate-area user-info'>
        <Avatar size='small' icon={<UserOutlined />} src={userInfo.avatar} />
        <span className='username'>{userInfo.username}</span>
      </section>
      <section className='operate-area'>
        <a onClick={logout} className='logout-button'>退出</a>
      </section>
    </div>
  )
}

export default memo(RightContent)
