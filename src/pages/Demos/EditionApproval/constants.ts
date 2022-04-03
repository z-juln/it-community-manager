import moment from 'moment';
import type { SearchFormData } from './interface';

export const initialFormData: SearchFormData = {
  apply_time: [
    moment().subtract(3, 'months'),
    moment()
  ]
}

export const timeFormat = 'HH:mm:ss'

export const dateFormat = 'YYYY-MM-DD ' + timeFormat
