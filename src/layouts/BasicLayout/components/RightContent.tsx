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
  // const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(true)
  // const [keyWord, setKeyWord] = useState<string>('')

  const afLinkUrl = useMemo(() => {
    return isDev ? '//af.hupu.com' : window.location.origin.replace('banwu', 'af')
  }, [])

  return (
    <div className='bbs-banwu-layout-header-right-content-wrapper'>
      {/* <Input
        placeholder='搜索'
        prefix={<img className='search-icon' src={SearchIcon} />}
        onFocus={() => setIsInputCollapsed(false)}
        onBlur={() => setIsInputCollapsed(true)}
        style={{ width: (keyWord || !isInputCollapsed) ? 250 : 104 }}
        value={keyWord}
        onChange={(e) => setKeyWord(e.target.value)}
      /> */}
      <section className='operate-area no-split'>
        <a href={afLinkUrl} target='_blank' className='af-out-link'>虎扑版主后台</a>
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
