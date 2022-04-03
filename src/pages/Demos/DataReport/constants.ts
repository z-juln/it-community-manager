import moment from "moment"
import type { QueryParams } from "./interface"

export const dateFormat = 'YYYY-MM-DD'

export const initQueryParams: QueryParams = {
  startTime: moment().add(-1, 'days').format(dateFormat),
  endTime: moment().add(-1, 'days').format(dateFormat)
}
