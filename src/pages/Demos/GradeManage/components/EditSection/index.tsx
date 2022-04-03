import { memo, useEffect, useMemo, useState } from "react"
import { Button, Input } from "antd"
import './index.less'

const cls = 'edit-section-comp'

export interface EditSectionProps {
  onChange?: (value: number) => void
  max?: number
  defaultValue?: string
}

function EditSection({
  onChange,
  max,
  defaultValue = '',
}: EditSectionProps) {

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)

  const tips = getTips(value, max)
  const isValid = useMemo(() => !tips.length, [tips])

  useEffect(() => {
    if (!editing) {
      reset()
    }
  }, [editing])

  const reset = () => {
    setEditing(false)
    setValue(defaultValue)
  }

  if (editing) {
    return (
      <div className={cls}>
        <div className={`${cls}-text`}>修改为</div>
        <Input
          className={`${cls}-input`}
          type="number"
          value={value}
          onInput={e => setValue(e.currentTarget.value)}
          style={{width: 200}}
          // onBlur={() => setEditing(false)}
          // onPressEnter={() => onChange?.(value)}
          autoFocus
          max={max}
        />
        <div className={`${cls}-tip`}>
          {tips.map(tip => <p>{tip}</p>)}
        </div>
        <div className={`${cls}-btn-group`}>
          <Button onClick={() => setEditing(false)}>取消</Button>
          <Button
            style={{marginLeft: '20px'}}
            type="primary"
            onClick={() => {
              if (isValid) {
                setEditing(false)
                onChange?.(+value)
              }
            }}
          >
            保存
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button onClick={() => setEditing(true)}>
      修改分数
    </Button>
  )
}

export default memo(EditSection)

const getTips = (value: string, max?: number): string[] => {
  let tips: string[] = []

  const isExceed = typeof max === 'number'
    ? +value > max
      ? true
      : false
    : false
  const isSpace = value === ''
  const rangeErr = +value < 0 || +value > 100
  const isInt = !value.includes('.')

  if (isExceed) {
    tips.push(`不能高于本月当前分数: ${max}`)
  }
  if (isSpace) {
    tips.push('不能为空')
  }
  if (rangeErr || !isInt) {
    tips.push('仅支持输入0-100之间的整数')
  }

  return tips
}
