/**
 * 通过tab(即状态)获取要展示的表单colums
 * 用SuperColumn的hiddenTabs属性来控制
 */
import type { ColumnType } from "antd/lib/table"

export interface ColumnWithTab<RecordType, TabValue = unknown> extends ColumnType<RecordType> {
  hiddenTabs?: TabValue[]
}

function filterColumns<RecordType, TabValue>(columns: ColumnWithTab<RecordType, TabValue>[], status: TabValue): ColumnType<RecordType>[] {
  return columns.filter(column => !column?.hiddenTabs?.includes(status))
    .map(superColumn => {
      const column: ColumnWithTab<RecordType, TabValue> = { ...superColumn }
      delete column.hiddenTabs
      return column
    })
}

export const getDisplayColumns = <RecordType = unknown, TabValue = unknown>(columns: ColumnWithTab<RecordType, TabValue>[], status: TabValue) =>
  filterColumns<RecordType, TabValue>(columns, status)
