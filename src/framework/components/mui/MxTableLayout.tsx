
import React from "react"
import {
  CsCheckBoxItem,
  CsInputDateItem,
  CsInputDateRangeItem,
  CsInputNumberItem,
  CsInputNumberRangeItem,
  CsInputPasswordItem,
  CsInputTextItem,
  CsItemBase,
  CsMultiCheckBoxItem,
  CsRadioBoxItem,
  CsSelectBoxItem,
  CsSelectNumberBoxItem,
  CsTextAreaItem,
  CsView,
} from "../../logics"

import {
  MxCheckBox,
  MxInputDate,
  //   MxInputDateRange,
  MxInputNumber,
  MxInputNumberRange,
  MxInputPassword,
  MxInputText,
  MxMultiCheckBox,
  MxProps,
  MxRadioBox,
  MxSelectBox,
  MxSelectNumberBox,
  MxTextArea,
} from "."
import { Grid } from "@mui/material"

export interface MxTableLayoutProps {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  hideLabel?: boolean
}

export const MxTableLayout = (props: MxTableLayoutProps) => {
  const v = props.view
  const items: CsItemBase[] = []
  for (const value of Object.values(v)) {
    if (value instanceof CsItemBase) {
      items.push(value)
    }
  }
  const rowLimit = Math.floor(items.length / props.colSize + (items.length % props.colSize === 0 ? 0 : 1))
  const rows: Array<number> = new Array(rowLimit)
  rows.fill(0) // fill by 0 because map/forEach ignores undefined elements
  const cols: Array<number> = new Array(props.colSize)
  cols.fill(0) // ditto

  const colSpan = 12 / props.colSize
  let x = 0
  let j = 0
  let k = 0
  return (
    <Grid container>
      {rows.map((row) => {
        return (
          <Grid container key={j++}>
            {cols.map((col) => {
              return (
                <Grid item key={k++} xs={colSpan}>
                  <SelectComponent key={items[x]?.key}
                    item={items[x++]}
                    labelPlacement={props.labelPlacement}
                    labelWidth={props.labelWidth}
                    hideLabel={props.hideLabel} />
                </Grid>
              )
            })}
          </Grid>
        )
      })}
    </Grid>
  )
}

export const selectComponent = (item: CsItemBase, hideLabel?: boolean, labelPlacement?: "top" | "left", labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: MxProps<CsInputTextItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxInputText {...props} />
  }
  if (item instanceof CsInputNumberItem) {
    const props: MxProps<CsInputNumberItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxInputNumber {...props} />
  }
  if (item instanceof CsTextAreaItem) {
    const props: MxProps<CsTextAreaItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxTextArea {...props} />
  }
  if (item instanceof CsCheckBoxItem) {
    const props: MxProps<CsCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxCheckBox {...props} />
  }
  if (item instanceof CsInputPasswordItem) {
    const props: MxProps<CsInputPasswordItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxInputPassword {...props} />
  }
  if (item instanceof CsRadioBoxItem) {
    const props: MxProps<CsRadioBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxRadioBox {...props} />
  }
  if (item instanceof CsSelectNumberBoxItem) {
    const props: MxProps<CsSelectNumberBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxSelectNumberBox {...props} />
  }
  if (item instanceof CsSelectBoxItem) {
    const props: MxProps<CsSelectBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxSelectBox {...props} />
  }
  if (item instanceof CsMultiCheckBoxItem) {
    const props: MxProps<CsMultiCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxMultiCheckBox {...props} />
  }
  if (item instanceof CsInputDateItem) {
    const props: MxProps<CsInputDateItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxInputDate {...props} />
  }
  if (item instanceof CsInputNumberRangeItem) {
    const props: MxProps<CsInputNumberRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <  MxInputNumberRange {...props} />
  }
  // if (item instanceof CsInputDateRangeItem) {
  //   const props:  MxProps<CsInputDateRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
  //   return <  MxInputDateRange {...props} />
  // }
  return <NullElement />
}

const NullElement = () => {
  return <></>
}

const SelectComponent: React.FC<{
  item: CsItemBase
  hideLabel?: boolean
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
}> = (props) => {
  return selectComponent(props.item, props.hideLabel, props.labelPlacement, props.labelWidth,)
}
