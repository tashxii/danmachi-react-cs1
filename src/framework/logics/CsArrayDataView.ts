import { Dispatch, SetStateAction, useState } from "react"
import { CsCheckBoxItem, CsHasOptionsItem, CsItem, CsValidationItemBase, CsView } from "."
export class CsArrayDataView<E extends {} = any, V extends CsView = any> {
  headerView: V
  headers: { key: keyof E, width: string }[]
  dataSource: E[]
  setDataSource: Dispatch<SetStateAction<E[]>>
  validationErrorMessages: { [rowIndex: number]: { [key: string]: string } }
  setValidationErrorMessages: Dispatch<SetStateAction<{ [rowIndex: number]: { [key: string]: string } }>>
  widths: string[] = []
  rows: CsArrayDataRow<E, V>[]

  constructor(
    headerView: V,
    headers: { key: keyof E, width: string }[],
    dataSource: E[],
    setDataSource: Dispatch<SetStateAction<E[]>>,
    validationErrorMessages: { [rowIndex: number]: { [key: string]: string } },
    setValidationErrorMessages: Dispatch<SetStateAction<{ [rowIndex: number]: { [key: string]: string } }>>
  ) {
    this.headerView = headerView
    this.headers = headers
    this.dataSource = dataSource
    this.setDataSource = setDataSource
    this.validationErrorMessages = validationErrorMessages
    this.setValidationErrorMessages = setValidationErrorMessages
    this.rows = this.createRows()
  }

  setWidths(widths: string[]) {
    this.widths = widths
  }

  createRows(): CsArrayDataRow<E, V>[] {
    this.rows = []
    this.dataSource.forEach((e, index) => {
      this.rows.push(new CsArrayDataRow(this, index, e))
    })
    return this.rows
  }

  get headerItems(): CsItem[] {
    const ret: CsItem[] = []
    this.headers.forEach((header) => {
      const key = header.key as string
      const item = this.headerView[key as keyof V]
      if (item && item instanceof CsItem) {
        ret.push(item)
      }
    })
    return ret
  }

  getWidthOfKey(key: keyof E) {
    return this.headers.find((h) => (h.key === key))?.width || "auto"
  }

  // ValidationErrorMessageのrowIndex管理を連動して行うため、xxxRowメソッドを用意している

  /**
   * 新たな配列要素rowを追加します。
   * @param row 要素
   */
  addRow(element: E) {
    this.rows.push(new CsArrayDataRow(this, this.rows.length, element))
    this.setDataSource([...this.dataSource, element])
  }

  /**
   * 指定されたrowIndexの配列要素Rowを削除します。バリデーションエラーメッセージも合わせて削除されます。
   * @param rowIndex インデックス
   */
  deleteRow(rowIndex: number) {
    this.rows = this.rows.filter((_, index) => (index !== rowIndex))
    this.setDataSource(this.dataSource.filter((_, index) => index !== rowIndex))
    this.setValidationErrorMessages((prev) => {
      const newMessages: { [rowIndex: number]: { [key: string]: string } } = {}
      const rowIndexes = Object.keys(prev)
      rowIndexes.forEach((index) => {
        const orgIndex = Number(index)
        if (orgIndex !== rowIndex) {
          const newIndex = (orgIndex > rowIndex) ? orgIndex - 1 : orgIndex
          newMessages[newIndex] = prev[orgIndex]
        }
      })
      return newMessages
    })
  }

  /**
   * 指定されたrowIndexに要素Rowを挿入します。
   * @param rowIndex インデックス
   * @param row 挿入する要素
   */
  insertRow(rowIndex: number, element: E) {
    const newRows = []
    for (let i = newRows.length - 1; i >= 0; i--) {
      const row = this.rows[i]
      if (row.rowIndex > rowIndex) {
        row.setRowIndex(row.rowIndex + 1)
        newRows.push(row)
      } else if (row.rowIndex === rowIndex) {
        newRows.push(new CsArrayDataRow(this, rowIndex, element))
      } else {
        newRows.push(row)
      }
    }
    this.rows = newRows.reverse()
  }

  /**
   * 指定された2つのrowIndexの要素を入れ替えます。バリデーションエラーも合わせて入れ替わります
   * @param prevRowIndex
   * @param nextRowIndex
   */
  replaceRow(prevRowIndex: number, nextRowIndex: number) {
    const prev = this.rows[prevRowIndex]
    if (!prev) {
      throw new Error("Invalid rowIndex. except range: 0-" + (this.rows.length - 1) + ", but specified: " + prevRowIndex)
    }
    const next = this.rows[nextRowIndex]
    if (!next) {
      throw new Error("Invalid rowIndex. except range: 0-" + (this.rows.length - 1) + ", but specified: " + nextRowIndex)
    }
    const tempIndex = this.rows.length
    const prevIndex = prev.rowIndex
    const nextIndex = next.rowIndex
    prev.setRowIndex(tempIndex)
    next.setRowIndex(prevIndex)
    prev.setRowIndex(nextIndex)

    this.rows.sort((a, b) => (a.rowIndex - b.rowIndex))
  }

  /**
   * 指定したrowIndexの配列要素のバリデーションを実施します。
   * @param rowIndex
   * @returns エラーがあるとき、true
   */
  validateRow(rowIndex: number): boolean {
    const row = this.rows[rowIndex]
    if (!row) {
      throw new Error("Invalid rowIndex. except range: 0-" + (this.rows.length - 1) + ", but specified: " + rowIndex)
    }
    return row.validateRow()
  }

  /**
   * テーブルの持つ配列要素すべてのバリデーションを実施します
   * @returns エラーがあるとき、true
   */
  valiadteArrayData(): boolean {
    let hasError = false
    this.rows.forEach(row => {
      if (row.validateRow()) {
        hasError = true
      }
    })
    return hasError
  }
}

export class CsArrayDataRow<E extends {} = any, V extends CsView = any> {
  arrayView: CsArrayDataView<E, V>
  rowIndex: number
  rowData: E
  colItems: CsArrayDataItem<E, V>[]
  constructor(arrayView: CsArrayDataView<E, V>, rowIndex: number, e: E) {
    this.arrayView = arrayView
    this.rowIndex = rowIndex
    this.rowData = e
    this.colItems = []
    const keys = this.arrayView.headers.map((h) => h.key)
    const viewKeys = Object.keys(this.arrayView.headerView)
    for (const key of keys) {
      for (const viewKey of viewKeys) {
        // Viewに定義されたキーのみ対象
        const value = this.arrayView.headerView[viewKey as keyof V]
        if (value instanceof CsItem) {
          // ArrayのElement "E"のキーが一致したらアイテムとして追加。それ以外は無視する
          if (key === viewKey) {
            this.colItems.push(new CsArrayDataItem(
              key as keyof E, value, this
            ))
          }
        }
      }
    }
  }

  validateRow() {
    let hasError = false
    this.colItems.forEach(colItem => {
      if (colItem.validate(colItem.value)) {
        hasError = true
      }
    })
    return hasError
  }

  setRowIndex(newRowIndex: number) {
    const oldRowIndex = this.rowIndex
    const validationErrorMessages = this.arrayView.validationErrorMessages
    const setValidationErrorMessages = this.arrayView.setValidationErrorMessages
    const newMessages = { ...validationErrorMessages }
    const oldRowMessages = newMessages[oldRowIndex]
    if (oldRowMessages) {
      newMessages[newRowIndex] = { ...oldRowMessages }
      newMessages[oldRowIndex] = {}
    }
    this.rowIndex = newRowIndex
    setValidationErrorMessages({ ...newMessages })
  }
}

export class CsArrayDataItem<E extends {} = any, V extends CsView = any, T extends E[keyof E] = any> extends CsValidationItemBase<T> {
  key: string
  row: CsArrayDataRow<E, V>
  headerItem: CsItem<T>
  constructor(key: keyof E, headerItem: CsItem<T>, row: CsArrayDataRow<E, V>) {
    super()
    this.key = key as string
    this.headerItem = headerItem
    this.row = row
    this.parentView = headerItem.parentView
    this.label = headerItem.label
    this.isReadonly = headerItem.isReadonly
  }

  get value(): T {
    return this.row.rowData[this.key as keyof E] as T
  }

  setValue(value: T) {
    const setDataSource = this.row.arrayView.setDataSource
    const dataSource = this.row.arrayView.dataSource
    const editRowData = { ...this.row.rowData }
    editRowData[this.key as keyof E] = value
    setDataSource(
      dataSource.map((row, index) => (this.row.rowIndex === index ? editRowData : row))
    )
  }

  get validationMessage() {
    const validationErrorMessages = this.row.arrayView.validationErrorMessages
    const rowMessages = validationErrorMessages[this.row.rowIndex]
    if (!rowMessages) {
      return ""
    }
    return rowMessages[this.key] || ""
  }

  setValidationMessage(message: string): void {
    const setValidationErrorMessages = this.row.arrayView.setValidationErrorMessages
    setValidationErrorMessages((prev) => {
      let rowMessages = prev[this.row.rowIndex]
      if (!rowMessages) {
        rowMessages = {}
      }
      const newRowMessage = { ...rowMessages, [this.key]: message }
      console.warn(newRowMessage)
      const newValidationMessages = { ...prev, [this.row.rowIndex]: newRowMessage }
      return newValidationMessages
    })
  }

  get validationRule() {
    return this.headerItem.validationRule
  }

  get hasValidationError(): boolean {
    return (this.validationErrorMessage.length > 0)
  }

  get validationErrorMessage(): string {
    if (this.validationMessage) {
      return this.validationMessage
    }
    return ""
  }

  validate(newValue: T | undefined): boolean {
    if (!this.headerItem.validationRule.required && !newValue) {
      return false
    }
    return this.validateAnytime(newValue)
  }

  validateWhenErrorExists(newValue: T | undefined): boolean {
    if (!this.hasValidationError) {
      return false
    }
    return this.validateAnytime(newValue)
  }

  validateAnytime(newValue: T | undefined): boolean {
    const validationEvent = this.headerItem.parentView?.validationEvent
    if (validationEvent) {
      return validationEvent.onValidateItemHasError(newValue, this)
    }
    return false
  }

  // CsHasOptionItemをエミュレートするメソッド
  get options() {
    const defItem = this.headerItem
    if (defItem instanceof CsHasOptionsItem) {
      const optionItem: CsHasOptionsItem = defItem as CsHasOptionsItem
      return optionItem.options
    }
    return []
  }

  // CsHasOptionItemをエミュレートするメソッド
  get optionValueKey() {
    const defItem = this.headerItem
    if (defItem instanceof CsHasOptionsItem) {
      const optionItem: CsHasOptionsItem = defItem as CsHasOptionsItem
      return optionItem.optionValueKey
    }
    return ""
  }

  // CsHasOptionItemをエミュレートするメソッド
  get optionLabelKey() {
    const defItem = this.headerItem
    if (defItem instanceof CsHasOptionsItem) {
      const optionItem: CsHasOptionsItem = defItem as CsHasOptionsItem
      return optionItem.optionLabelKey
    }
    return ""
  }

  // CsCheckBoxItemをエミュレートするメソッド
  get checkBoxText() {
    const defItem = this.headerItem
    if (defItem instanceof CsCheckBoxItem) {
      const checkboxItem: CsCheckBoxItem = defItem as CsCheckBoxItem
      return checkboxItem.checkBoxText
    }
    return ""
  }
}

export const useCsArrayDataView = <V extends CsView, E extends {}>(
  headerView: V,
  headers: { key: keyof E, width: string }[],
  initArrayData: E[]
): CsArrayDataView<E, V> => {
  const [dataSource, setDataSource] = useState<E[]>(initArrayData)
  const [validationErrorMessage, setValidationErrorMessaages] = useState<{ [rowIndex: number]: { [key: string]: string } }>({})
  return new CsArrayDataView(headerView, headers, dataSource, setDataSource, validationErrorMessage, setValidationErrorMessaages)
}
