import type { IPostItem } from '@/components'
import type { MouseEvent } from 'react'
import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import Viewer from 'viewerjs'
import ContentViewer from './ContentViewer'
import { Button } from 'antd'
import { gotoPostPage, IS_FIREFOX } from '@/utils/common'
import { ReplyQuote } from '@/components/index'
import './index.less'
interface PostContentProps<T> {
  postItem: T
  className?: string
}

const PostContent = <T extends IPostItem>({
  className,
  postItem: { content, videos = [], isVote, tid, msgId, quoto }
}: PostContentProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  // 代理点击事件，查看图片
  const handleClickEvent = useCallback((e: MouseEvent<Element>) => {
    const { className, nodeName, currentSrc, dataset = {} } = e.target as HTMLImageElement | HTMLVideoElement
    if (nodeName === 'IMG' && currentSrc) {
      e.stopPropagation()
    } else if (nodeName === 'VIDEO' && currentSrc) { // 点击视频
      window.open(currentSrc)
    } else if (nodeName === 'DIV' && className === 'slate-video') { //  点击播放icon
      window.open(((e.target as HTMLDivElement).childNodes[0] as HTMLVideoElement).currentSrc)
    } else if (dataset.cell === 'content') {
      onGotoBbs()
    }
  }, [])

  const onGotoBbs = useCallback(() => {
    gotoPostPage(tid, msgId)
  }, [tid, msgId])

  const firstVideo = useMemo(() => videos[0], [videos])

  useEffect(() => {
    if (wrapperRef.current) new Viewer(wrapperRef.current, {
      filter(image: HTMLImageElement) {
        // 视频不打开弹框
        return !image.className.includes('video')
      },
    })
  }, [])

  return (
    <div
      className={`bbs-banwu-post-content-wrapper ${className}`}
      onClick={handleClickEvent}
      ref={wrapperRef}
    >
      {firstVideo &&
        <div className='video-cover-box' onClick={() => window.open(firstVideo.url)}>
          {/* 自闭合标签不支持伪元素 */}
          <img
            className='video-cover'
            src={firstVideo.cover}
          />
        </div>}
      {/* 主回帖正文 */}
      <div dangerouslySetInnerHTML={{ __html: content }} data-cell='content' style={IS_FIREFOX ? {
        WebkitBoxOrient: 'unset',
        display: 'block'
      } : {}} />
      {/* 回帖引用 */}
      {quoto?.content ?
        <ReplyQuote
          quoto={quoto}
          onGotoBbs={onGotoBbs}
          className='small-reply-quote'
        /> : null}
      <section className='operate-area'>
        {isVote && <Button type='link' onClick={onGotoBbs} style={{ color: '#7cb305' }}>[vote]</Button>}
        <Button type='link' onClick={onGotoBbs} style={{ color: '#3169E8' }}>前往原贴</Button>
        <span className='split-icon' />
        <Button type='link' onClick={() => setIsModalVisible(true)} style={{ color: '#3169E8' }}>查看全文</Button>
      </section>
      {/* 查看全文 */}
      <ContentViewer
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={content}
        onGotoBbs={onGotoBbs}
        quoto={quoto}
        videos={videos}
      />
    </div>
  )
}

export default memo(PostContent) as <T extends IPostItem>(props: PostContentProps<T>) => React.ReactElement
