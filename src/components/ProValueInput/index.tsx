import React, { memo } from 'react'
import { Input, InputProps } from 'antd'
import numberParse from '@/utils/numberParse'

interface ProValueInputProps extends Omit<InputProps, 'onChange'> {
  /** 预处理正则 */
  format?: RegExp
  /** 重写onChange */
  onChange?: (value: string) => void
}

const ProValueInput = ({
  value,
  onChange = () => { },
  format,
  ...restProps
}: ProValueInputProps,
  ref?: React.Ref<Input>
) => {

  // 处理输入
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const origin_value = e.target.value
    if (format) {
      onChange(
        numberParse(origin_value,
          { customRegexp: format }
        ) || ''
      )
    } else {
      onChange(origin_value)
    }
  }

  return (
    <Input
      ref={ref}
      {...restProps}
      value={value}
      onChange={handleChange}
    />
  )
}

export default memo(
  React.forwardRef(ProValueInput) as (
    props: ProValueInputProps & { ref?: React.Ref<Input> }
  ) => React.ReactElement
)
