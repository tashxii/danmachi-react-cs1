
import React from "react"
import {
  CsCheckBoxItem,
  CsInputDateItem,
  CsInputDateRangeItem,
  CsInputNumberItem,
  CsInputNumberRangeItem,
  CsInputPasswordItem,
  CsInputTextItem,
  CsMultiCheckBoxItem,
  CsRadioBoxItem,
  CsSelectBoxItem,
  CsSelectNumberBoxItem,
  CsTextAreaItem,
} from "../../logics"

import {
  MxCheckBox,
  MxInputDate,
  //   MxInputDateRange,
  MxInputNumber,
  MxInputNumberRange,
  MxInputPassword,
  MxInputText,
  MxLabel,
  MxMultiCheckBox,
  MxProps,
  MxRadioBox,
  MxSelectBox,
  MxSelectNumberBox,
  MxTextArea,
  getLabel,
} from "."
import { Button, Grid } from "@mui/material"
import { CsArrayDataItem, CsArrayDataView } from "../../logics/CsArrayDataView"

export interface MxArrayDataTableProps {
  view: CsArrayDataView
  hideLabel?: boolean
  showDeleteAction?: boolean
  showRequiredTag?: "both" | "required" | "optional" | "none"
}

export const MxArrayDataTable = (props: MxArrayDataTableProps) => {
  const v = props.view
  const showRequiredTag = props.showRequiredTag ?? "both"
  const hideLabel = props.hideLabel === false ? false : true
  const showDeleteAction = props.showDeleteAction === false ? false : true
  const items: CsArrayDataItem[] = []
  for (const value of Object.values(v)) {
    if (value instanceof CsArrayDataItem) {
      items.push(value)
    }
  }
  let k = 0
  let j = 0
  const rows = v.rows
  return (
    <Grid container>
      {/* ヘッダー */}
      <Grid container>
        {v.headerItems.map((item) => (
          <Grid item key={k++} style={{ width: v.getWidthOfKey(item.key) }}>
            <MxLabel label={getLabel(item, showRequiredTag)}></MxLabel>
          </Grid>)
        )}
        {showDeleteAction && (
          <Grid item key={-1} style={{ width: "auto", alignContent: "center" }}>
            <MxLabel label={"操作"} />
          </Grid>
        )}
      </Grid>
      {/* 配列 */}
      {
        rows.map((row) => {
          return (
            <Grid container key={j++}>
              {row.colItems.map((col) => {
                return (
                  <Grid item key={k++} style={{ width: v.getWidthOfKey(col.headerItem.key) }}>
                    <SelectComponent key={`${row.rowIndex}-${col.key}`}
                      item={col}
                      hideLabel={hideLabel} />
                  </Grid>
                )
              })}
              {showDeleteAction && (
                <Grid item key={row.rowIndex} style={{ width: "auto", alignContent: "center" }}>
                  <Button variant="outlined" style={{ color: "orange", borderColor: "red" }} onClick={() => { props.view.deleteRow(row.rowIndex) }}>行の削除</Button>
                </Grid>
              )}
            </Grid>
          )
        })
      }
    </Grid >
  )
}

export const selectComponent = (item: CsArrayDataItem, hideLabel?: boolean): JSX.Element => {
  const defItem = item.headerItem
  if (defItem instanceof CsInputTextItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxInputText {...props} />
  }
  if (defItem instanceof CsInputNumberItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxInputNumber {...props} />
  }
  if (defItem instanceof CsTextAreaItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxTextArea {...props} />
  }
  if (defItem instanceof CsCheckBoxItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxCheckBox {...props} />
  }
  if (defItem instanceof CsInputPasswordItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxInputPassword {...props} />
  }
  if (defItem instanceof CsRadioBoxItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxRadioBox {...props} />
  }
  if (defItem instanceof CsSelectNumberBoxItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxSelectNumberBox {...props} />
  }
  if (defItem instanceof CsSelectBoxItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxSelectBox {...props} />
  }
  if (defItem instanceof CsMultiCheckBoxItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxMultiCheckBox {...props} />
  }
  if (defItem instanceof CsInputDateItem) {
    const props: MxProps<CsArrayDataItem> = { item, hideLabel }
    return <  MxInputDate {...props} />
  }
  if (defItem instanceof CsInputNumberRangeItem) {
    // Not supported
    return <NullElement />
  }
  if (defItem instanceof CsInputDateRangeItem) {
    // Not supported
    return <NullElement />
  }
  return <NullElement />
}

const NullElement = () => {
  return <></>
}

const SelectComponent: React.FC<{
  item: CsArrayDataItem
  hideLabel?: boolean
}> = (props) => {
  return selectComponent(props.item, props.hideLabel)
}
