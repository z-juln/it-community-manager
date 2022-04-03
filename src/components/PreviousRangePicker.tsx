import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;

type ThisProps = React.ComponentProps<typeof RangePicker> & {
  beforeYesterday?: boolean
}

export default function PreviousRangePicker({
  beforeYesterday,
  ...otherProps
}: ThisProps) {
  let defaultValue: [moment.Moment, moment.Moment]
  let disabledDate: (date: moment.Moment) => boolean
  if(beforeYesterday) {
    defaultValue = [moment().add(-1, 'days'), moment().add(-1, 'days')]
    disabledDate = (date: moment.Moment) => (date && date > moment().add(-1, 'days'))
  } else {
    defaultValue = [moment().startOf('day'), moment().endOf('day')]
    disabledDate = (date: moment.Moment) => (date && date > moment().endOf('day'))
  }

  return (
    <RangePicker
      defaultValue={defaultValue}
      disabledDate={disabledDate}
      {...otherProps}
     />
  )
}
