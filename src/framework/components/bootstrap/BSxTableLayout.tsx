
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
  BSxCheckBox,
  BSxInputDate,
  //  BSxInputDateRange,
  BSxInputNumber,
  BSxInputNumberRange,
  BSxInputPassword,
  BSxInputText,
  BSxMultiCheckBox,
  BSxProps,
  BSxRadioBox,
  BSxSelectBox,
  BSxSelectNumberBox,
  BSxTextArea,
} from "."
import { Col, Container, Row } from "react-bootstrap"

export interface BSxTableLayoutProps {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  hideLabel?: boolean
}

export const BSxTableLayout = (props: BSxTableLayoutProps) => {
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
    <div>
      {rows.map((row) => {
        return (
          <Row key={j++}>
            {cols.map((col) => {
              return (
                <Col key={k++} md={colSpan}>
                  <SelectComponent key={items[x]?.key}
                    item={items[x++]}
                    labelPlacement={props.labelPlacement}
                    labelWidth={props.labelWidth}
                    hideLabel={props.hideLabel} />
                </Col>
              )
            })}
          </Row>
        )
      })}
    </div>
  )
}

export const selectComponent = (item: CsItemBase, hideLabel?: boolean, labelPlacement?: "top" | "left", labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: BSxProps<CsInputTextItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxInputText {...props} />
  }
  if (item instanceof CsInputNumberItem) {
    const props: BSxProps<CsInputNumberItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxInputNumber {...props} />
  }
  if (item instanceof CsTextAreaItem) {
    const props: BSxProps<CsTextAreaItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxTextArea {...props} />
  }
  if (item instanceof CsCheckBoxItem) {
    const props: BSxProps<CsCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxCheckBox {...props} />
  }
  if (item instanceof CsInputPasswordItem) {
    const props: BSxProps<CsInputPasswordItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxInputPassword {...props} />
  }
  if (item instanceof CsRadioBoxItem) {
    const props: BSxProps<CsRadioBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxRadioBox {...props} />
  }
  if (item instanceof CsSelectNumberBoxItem) {
    const props: BSxProps<CsSelectNumberBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxSelectNumberBox {...props} />
  }
  if (item instanceof CsSelectBoxItem) {
    const props: BSxProps<CsSelectBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxSelectBox {...props} />
  }
  if (item instanceof CsMultiCheckBoxItem) {
    const props: BSxProps<CsMultiCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxMultiCheckBox {...props} />
  }
  if (item instanceof CsInputDateItem) {
    const props: BSxProps<CsInputDateItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxInputDate {...props} />
  }
  if (item instanceof CsInputNumberRangeItem) {
    const props: BSxProps<CsInputNumberRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
    return < BSxInputNumberRange {...props} />
  }
  // if (item instanceof CsInputDateRangeItem) {
  //   const props: BSxProps<CsInputDateRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
  //   return < BSxInputDateRange {...props} />
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
