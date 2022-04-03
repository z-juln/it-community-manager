import { memo } from 'react'
import { Tag } from 'antd'
import { gotoPostPage } from '@/utils/common'
import './index.less'

interface PostTitleProps<T> {
  postItem: T
}
const PostTitle = <T extends Record<string, any>>({
  postItem: { title = '', tid, isReply, lightCount = 0, unlightCount = 0 }
}: PostTitleProps<T>) => {

  return (
    <div onClick={() => gotoPostPage(tid)} className='bbs-banwu-post-title-wrapper'>
      {
        !isReply ? <Tag color='blue' style={{ border: 0 }}>主贴</Tag> :
          <>
            <div className='post-attr-box'>
              <span>
                <i className='light-icon' />
                <span>亮({lightCount})</span>
              </span>
              <span>
                <i className='unlight-icon' />
                <span>灭({unlightCount})</span>
              </span>
            </div>
            <Tag color='orange' style={{ border: 0 }}>回贴</Tag>
          </>
      }
      {title}
    </div>
  )
}

export default memo(PostTitle) as <T extends Record<string, any>>(props: PostTitleProps<T>) => React.ReactElement
