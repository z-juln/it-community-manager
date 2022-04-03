import React, { useCallback, useEffect, useState } from 'react'
import { Table } from 'antd'
import _ from 'lodash-es'

interface MainTableProps extends React.ComponentProps<typeof Table> {

}

export default function MainTable({
  ...config
}: MainTableProps) {

  const [bodyHeight, setBodyHeight] = useState('0px')

  // 动态设置高度
  const onresize = useCallback(
    _.throttle(
      () => {
        const bodyMinHeight = 300
        const screeningSectionHeight = document.querySelector('.inner-layout__screening-section')!.clientHeight
        let restHeight = screeningSectionHeight + 260
        if(screeningSectionHeight + 260 + bodyMinHeight > window.innerHeight) {
          setBodyHeight(`${bodyMinHeight}px`)
        } else {
          setBodyHeight(`calc(100vh - ${restHeight}px)`)
        }
      },
      100
    ),
    []
  )

  useEffect(() => {
    onresize()
    window.addEventListener('resize', onresize)
    return () => window.removeEventListener('resize', onresize)
  }, [])

  return (
    <>
      <Table
        {...config}
        bordered
        scroll={{x: 2000, y: bodyHeight}}
        size="small"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['20', '50'],
          showTotal: (total) => `共 ${total} 条`,
          ...(config.pagination || {})
        }}
      >
        {}
      </Table>
    </>
  )
}
