import PubSub from 'pubsub-js'

// 跳转帖子详情页
export const gotoPostPage = (tid: string, pid?: string) => {
  if (tid) {
    window.open(
      (pid && pid !== '0') ?
        `//bbs.hupu.com/${tid}.html?pid=${pid}`  // 回帖
        :
        `//bbs.hupu.com/${tid}.html` // 主贴
    )
  } else {
    throw new Error('tid为空，忽略跳转')
  }
}

export const hexToRgba = (hex: string, opacity: number = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ?
    `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${opacity})`
    : undefined
}

// 退出登录，先到logout清掉cookie，再到 passport登录页面（后面带上回流的地址），
export const logout = () => {
  PubSub.publish('logout')
}

// 判断火狐浏览器
export const IS_FIREFOX = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)
