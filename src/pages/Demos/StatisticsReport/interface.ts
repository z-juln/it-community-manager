export interface QueryParams {
  startTime: string
  endTime: string
}

export interface TableRecord {
  uid: number
  username: string | null
  readCount: number | null
  frontCount: number | null
  selfSeeCount: number | null
  deleteCount: number | null
  stepSealCount: number | null
  banCount: number | null
  operationCount: number | null
}
