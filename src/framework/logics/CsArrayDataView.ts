import { Dispatch, SetStateAction, useState } from "react"
import { CsEvent, CsItem, CsItemBase, CsView } from "."

export class CsArrayDataView<E extends {}, V extends CsView> {
  view: V
  widths: string[] = []
  dataSource: E[]
  setDataSource: Dispatch<SetStateAction<E[]>>
  validationErrorMessages?: { [rowIndex: number]: { [key: string]: string } }
  setValidationErrorMessaages?: Dispatch<SetStateAction<{ [rowIndex: number]: { [key: string]: string } }>>
  rows: CsArrayDataRow<E, V>[];
  constructor(view: V, dataSource: E[], setDataSource: Dispatch<SetStateAction<E[]>>) {
    this.view = view
    this.dataSource = dataSource
    this.setDataSource = setDataSource
    this.rows = this.createRows()
  }
  setWidths(widths: string[]) {
    this.widths = widths
  }
  createRows(): CsArrayDataRow<E, V>[] {
    this.rows = []
    this.dataSource.forEach((e, index) => {
      this.rows.push(new CsArrayDataRow(this, index))
    })
    return this.rows
  }
}

export class CsArrayDataRow<E extends {}, V extends CsView> {
  tableView: CsArrayDataView<E, V>
  rowIndex: number
  rowData: E
  colItems: CsArrayDataItem<E, V>[]
  constructor(tableView: CsArrayDataView<E, V>, rowIndex: number) {
    this.tableView = tableView
    this.rowIndex = rowIndex
    this.rowData = tableView.dataSource[rowIndex]
    this.colItems = []
    const keys = Object.keys(this.rowData)
    const viewKeys = Object.keys(this.tableView.view)
    for (const viewKey of viewKeys) {
      const value = this.tableView.view[viewKey as keyof V]
      if (value instanceof CsItem) {
        const key = keys.find((key) => (viewKey === key))
        if (key) {
          this.colItems.push(new CsArrayDataItem(
            key as keyof E, value, this
          ))
        }
      }
    }
  }
}

export class CsArrayDataItem<E extends {}, V extends CsView, T extends E[keyof E] = any> {
  key: keyof E
  row: CsArrayDataRow<E, V>
  defItem: CsItem<T>
  readonly: boolean = false
  validationMessasge: string
  constructor(key: keyof E, defItem: CsItem<T>, row: CsArrayDataRow<E, V>) {
    this.key = key
    this.defItem = defItem
    this.row = row
    this.validationMessasge = ""
  }
  get value(): T {
    return this.row.rowData[this.key] as T
  }

  setValue(value: T) {
    const setDataSource = this.row.tableView.setDataSource
    const dataSource = this.row.tableView.dataSource
    const editRowData = { ...this.row.rowData }
    editRowData[this.key] = value
    setDataSource(
      dataSource.map((row, index) => (this.row.rowIndex === index ? editRowData : row))
    )
  }
}

export const useCsArrayDataView = <V extends CsView, E extends {}>(
  view: V,
  initArrayData: E[]
): CsArrayDataView<E, V> => {
  const [dataSource, setDataSource] = useState<E[]>(initArrayData)
  return new CsArrayDataView(view, dataSource, setDataSource)
}
