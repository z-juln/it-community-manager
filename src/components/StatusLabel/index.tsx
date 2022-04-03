import React from "react"
import CustomTag, { CustomTagProps } from "@/components/CustomTag"
import { styles } from "./style.constants"

type StatusType = keyof typeof styles

interface StatusLabelProps {
  text: string
  type: StatusType
}

const StatusLabel = ({
  text = '',
  type = 'blue',
}: StatusLabelProps) => {

  const {color, opacity, style, icon} = getStyle(type)

  return (
    <CustomTag
      color={color}
      opacity={opacity}
      style={style}
      icon={icon}
    >
      {text}
    </CustomTag>
  )
}

export default StatusLabel

export type StatusStyle = Partial<CustomTagProps>

const commonStyle: StatusStyle = {
  opacity: 1,
  style: {
    backgroundColor: '#EFEFEF'
  }
}

const getStyle = (type: StatusType): StatusStyle & {color: string} => {
  const { color } = styles[type]
  return {
    ...commonStyle,
    ...styles[type],
    icon: <InnerIcon color={color} />
  }
}

const InnerIcon = ({color}: {color: string}) => (
  <i style={{ background: color, display: 'inline-block', marginRight: 3, verticalAlign: 'middle', borderRadius: '50%', width: 4, height: 4 }} />
)

