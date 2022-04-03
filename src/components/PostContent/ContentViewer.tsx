import type { MouseEvent } from 'react'
import { memo, useRef, useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import Viewer from 'viewerjs'
import { ReplyQuote, IQuote } from '@/components/index'
import './ContentViewer.less'

interface ContentViewerProps {
  visible: boolean
  onClose: () => void
  content: string
  quoto?: IQuote
  onGotoBbs: () => void
  videos: {
    cover: string
    tag: string
    url: string
  }[]
}
const ContentViewer = ({
  visible,
  onClose,
  content,
  quoto,
  onGotoBbs,
  videos
}: ContentViewerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 代理点击事件，查看图片
  const handleClickEvent = useCallback((e: MouseEvent<Element>) => {
    e.stopPropagation()
    const { className, nodeName, currentSrc } = e.target as HTMLVideoElement
    if (nodeName === 'VIDEO' && currentSrc) { // 点击视频
      window.open(currentSrc)
    } else if (nodeName === 'DIV' && className === 'slate-video') { //  点击播放icon
      window.open(((e.target as HTMLDivElement).childNodes[0] as HTMLVideoElement).currentSrc)
    }
  }, [])

  useEffect(() => {
    if (visible && wrapperRef.current) new Viewer(wrapperRef.current, {
      filter(image: HTMLImageElement) {
        // 视频不打开弹框
        return !image.className.includes('video')
      },
    })
  }, [visible])

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width={800}
      bodyStyle={{ paddingTop: 40 }}
      className='bbs-banwu-post-content-modal-viewer-wrapper'
    >
      <div ref={wrapperRef} onClick={handleClickEvent}>
        {/* 回帖引用 */}
        {quoto?.content ?
          <ReplyQuote
            quoto={quoto}
            onGotoBbs={onGotoBbs}
            className='large-reply-quote'
          />
          : null}
        {
          videos.map(video => (
            <div className='video-cover-box' onClick={() => window.open(video.url)} key={video.url}>
              <img
                className='video-cover'
                src={video.cover}
              />
            </div>
          ))
        }
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Modal>
  )
}

export default memo(ContentViewer)
