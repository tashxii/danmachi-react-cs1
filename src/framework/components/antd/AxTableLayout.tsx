import { Col, Row } from "antd"
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
  AxCheckBox,
  AxInputDate,
  AxInputDateRange,
  AxInputNumber,
  AxInputNumberRange,
  AxInputPassword,
  AxInputText,
  AxMultiCheckBox,
  AxProps,
  AxRadioBox,
  AxSelectBox,
  AxSelectNumberBox,
  AxTextArea,
} from "."

export interface AxTableLayoutProps {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  hideLabel?: boolean
}

export const AxTableLayout = (props: AxTableLayoutProps) => {
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

  const colSpan = 24 / props.colSize
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
                <Col key={k++} span={colSpan}>
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
    const props: AxProps<CsInputTextItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputText {...props} />
  }
  if (item instanceof CsInputNumberItem) {
    const props: AxProps<CsInputNumberItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputNumber {...props} />
  }
  if (item instanceof CsTextAreaItem) {
    const props: AxProps<CsTextAreaItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxTextArea {...props} />
  }
  if (item instanceof CsCheckBoxItem) {
    const props: AxProps<CsCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxCheckBox {...props} />
  }
  if (item instanceof CsInputPasswordItem) {
    const props: AxProps<CsInputPasswordItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputPassword {...props} />
  }
  if (item instanceof CsRadioBoxItem) {
    const props: AxProps<CsRadioBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxRadioBox {...props} />
  }
  if (item instanceof CsSelectNumberBoxItem) {
    const props: AxProps<CsSelectNumberBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxSelectNumberBox {...props} />
  }
  if (item instanceof CsSelectBoxItem) {
    const props: AxProps<CsSelectBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxSelectBox {...props} />
  }
  if (item instanceof CsMultiCheckBoxItem) {
    const props: AxProps<CsMultiCheckBoxItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxMultiCheckBox {...props} />
  }
  if (item instanceof CsInputDateItem) {
    const props: AxProps<CsInputDateItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputDate {...props} />
  }
  if (item instanceof CsInputNumberRangeItem) {
    const props: AxProps<CsInputNumberRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputNumberRange {...props} />
  }
  if (item instanceof CsInputDateRangeItem) {
    const props: AxProps<CsInputDateRangeItem> = { item, hideLabel, labelPlacement, labelWidth }
    return <AxInputDateRange {...props} />
  }
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
