/**
 * bug: node - xlsx依赖于node特有的Buffer对象，而浏览器环境没有
 * 解决方法：
  * 1. 安装额外依赖，使得浏览器支持Buffer
  * 2. 猜测webpack会给Buffer打补丁，而vite不会，可能配置vite也能实现
 */
import moment from "moment"
import xlsx from 'node-xlsx'
import fileSaver from 'file-saver'
import type { ColumnType } from "antd/lib/table"
import type { TableProps } from "antd/es/table"
import { useMemo } from "react"

export type XlsxData = Parameters<typeof xlsx.build>[0]

export type XlsxColumnType<RecordType> = ColumnType<RecordType> & { isXlsxTitle?: boolean }

// 导出xlsx
export function exportExcelInBrower(
  filename: string,
  data: XlsxData,
  { filenameWithTime } = { filenameWithTime: false }
) {
  const prefix = filenameWithTime ? `${moment().format('YYYY-MM-DD')}-` : ''
  const fullFilename = `${prefix}${filename}.xlsx`;
  const buffer = xlsx.build(data)
  fileSaver.saveAs(new Blob([buffer], { type: 'text/vnd.ms-excel;charset=utf-8' }), fullFilename)
}

// custom-hooks：table转xlsx数据
export function useXlsxData<
  ColumnType extends XlsxColumnType<any>,
  TableData extends TableProps<AnyObj>['dataSource']
>(
  filename: string,
  columns: ColumnType[],
  tableData: TableData
): XlsxData | null {
  return useMemo(() => {
    if (!tableData?.length) return null

    const sheet = getXlsxSheet(columns, tableData)
    // console.log('sheet: ', sheet)

    return [
      {
        name: filename,
        data: sheet,
      },
    ]
  }, [columns, tableData])
}

// table转xlsx数据
export function getXlsxSheet<
  ColumnType extends XlsxColumnType<any>,
  TableData extends TableProps<AnyObj>['dataSource']
>(
  columns: ColumnType[],
  tableData: TableData
) {
  const titles = columns
    .filter(col => col.isXlsxTitle)
    .map(col => col.title as string)

  const requiredIndexs = columns
    .filter(col => col.isXlsxTitle)
    .map(col => col.dataIndex as string) // requiredIndexs 如 ['all_num', 'del_num', ...]

  const body = tableData?.map(row => {
    // row 如 {all_num: 767 read_num: 733, del_num: 53, ...}
    const requiredRow: string[] = []
    Object.entries(row).forEach(([key, val]) => {
      if (requiredIndexs.includes(key)) requiredRow.push(val)
    })
    return requiredRow
  }) || []

  return [
    titles,
    ...body
  ]
}
