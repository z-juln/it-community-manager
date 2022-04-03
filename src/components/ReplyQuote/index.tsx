import { memo, useMemo } from 'react'
import { Button } from 'antd'
import './index.less'

interface ReplyQuoteProps {
  quoto: IQuote
  onGotoBbs: () => void
  className?: string
}
export type IQuote = {
  content: string
  videos: {
    cover: string
    tag: string
    url: string
  }[]
  votes: string[]
}
const ReplyQuote = ({
  quoto: { content = '', videos = [], votes = [] },
  onGotoBbs,
  className
}: ReplyQuoteProps) => {
  const firstVideo = useMemo(() => videos[0], [videos])
  const hasVotes = useMemo(() => votes.length > 0, [votes])

  return (
    <div className={`${className} bbs-banwu-reply-quote-wrapper`} onClick={onGotoBbs}>
      {firstVideo &&
        <div className='video-cover-box' onClick={() => window.open(firstVideo.url)}>
          <img
            className='video-cover'
            src={firstVideo.cover}
          />
        </div>
      }
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <section className='operate-area'>
        {hasVotes && <Button type='link' onClick={onGotoBbs} style={{ color: '#7cb305' }}>[vote]</Button>}
      </section>
    </div>
  )
}

export default memo(ReplyQuote)
