// 专区 树状选择器
import React, { useMemo, useState } from 'react'
import type { TreeSelectProps } from 'antd';
import { TreeSelect, message } from 'antd'
import { MODERATOR_APPROVAL_DETAIL_GET_TOPICS } from '@/apis/moderatorApproval'
import type { Cate, Topic } from './interface';
import { isCate } from './interface'
import type { DataNode } from 'rc-tree-select/lib/interface'
import { useCheckUnMounted, useMount } from '@/utils/custom-hooks';
import { last } from 'lodash-es'

PubSub.subscribe('logout', () => {
  localStorage.removeItem('zone-tree')
})

interface ZoomTreeSelectProps extends TreeSelectProps<any> {
  allValue?: number | string | null // 覆盖全站的value
}
const ZoomTreeSelect = ({ allValue, ...props }: ZoomTreeSelectProps) => {
  const ALL = allValue ?? 0 // “全站”节点对应的值

  const { value, onChange } = props

  const checkUnMounted = useCheckUnMounted()
  const [treeData, setTreeData] = useState<DataNode[]>(props.treeData || [])
  // allIsSelected即“全站”节点的选择状态
  const [allIsSelected, setAllIsSelected] = useState(false)

  useMount(() => {
    initTreeData()
  })

  const displayTreeData: DataNode[] = useMemo(() => {
    const allNode = treeData.find(item => item.value === ALL) // allNode是“全站”节点，不是所有节点
    // console.log(allNode, allNode ? [allNode] : treeData)
    return (allNode && allIsSelected) ? [allNode] : treeData
  }, [allIsSelected, treeData])

  const onSelectAll = () => setAllIsSelected(true)
  const onDeselectAll = () => setAllIsSelected(false)
  const onClear = () => setAllIsSelected(false)

  const initTreeData = () => {
    const treeData: DataNode[] = JSON.parse(localStorage.getItem('zone-tree') || '[]')
    if (treeData.length) {
      setTreeData(treeData)
      return
    }
    MODERATOR_APPROVAL_DETAIL_GET_TOPICS()
      .then((res: InnerResponse<{topicList: Cate[]}>) => {
        if (checkUnMounted()) return
        if (res.status === 200) {
          const treeData = parseTree(res.result?.topicList || [])
          localStorage.setItem('zone-tree', JSON.stringify(treeData))
          setTreeData(treeData)
          console.log('zone-tree: ', treeData)
        } else {
          message.error(res.msg)
        }
      })
  }

  return (
    <TreeSelect
      placeholder="请选择专区"
      treeCheckable
      allowClear
      treeData={displayTreeData}
      filterTreeNode={(inputValue, option) => String(option?.title).indexOf(inputValue) !== -1}
      {...props}
      value={allIsSelected ? [ALL] : value}
      onSelect={val => val === ALL ? onSelectAll() : void (0)}
      onDeselect={val => val === ALL ? onDeselectAll() : void (0)}
      onClear={onClear}
      onChange={(list: number[], ...params) => {
        const hasALL = last(list) === ALL
        setAllIsSelected(hasALL)
        onChange?.(hasALL ? [ALL] : list.filter(v => v !== ALL), ...params)
      }}
    />
  )
}

export default ZoomTreeSelect

function parseTree(data: Cate[] | Topic[] | undefined): DataNode[] {
  if (!data) return []
  const result: DataNode[] = []
  data.map(item => {
    if (isCate(item)) {
      result.push({
        title: item.cateName,
        key: -item.cate_id,
        value: -item.cate_id,
        children: parseTree(item.topicList)
      })
    } else {
      result.push({
        title: item.name,
        key: item.topic_id,
        value: item.topic_id
      })
    }
  })
  return result
}
