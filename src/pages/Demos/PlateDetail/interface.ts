export interface TableRecord {
  reportCount: number
  selfSeeCount: number
  frontCount: number
  readCount: number
  deleteCount: number
  stepSealCount: number
  banCount: number
  topicId: string
  topicName: string
  unHandleCount: number
}

export interface QueryParams {
  startTime: string
  endTime: string
  firstLevelTopicId?: number
}
