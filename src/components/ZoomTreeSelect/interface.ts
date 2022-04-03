// 由后端api返回的结构决定
export interface Cate {
  cateName: string
  cate_id: number
  status: number
  topicList: Topic[]
}

// 由后端api返回的结构决定
export interface Topic {
  cate_id: number
  name: string
  topic_id: number
}

export function isCate(data: any): data is Cate {
  return !!(data?.cateName)
}

export function isTopic(data: any): data is Topic {
  return !!(data?.name)
}
