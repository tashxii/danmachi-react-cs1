import React from "react"
import { Col, Row } from "antd"
import Antd from "../antd"
import { CsCheckBoxItem, CsItemBase, CsInputPassword, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem, CsView, CsInputNumberItem } from "../cs"
import { CxCheckBox, CxInputNumber, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxInputText } from "./CxCtrl"
import { CsMultiCheckBoxItem, CsSelectNumberBoxItem } from "../cs/CsItem"
import { AxMultiCheckBox, AxSelectNumberBox } from "../antd/AxCtrl"
import { CsInputDateItem, CsInputNumberRangeItem } from "../cs/CsItemAdvanced"
import { AxInputDate, AxInputNumberRange } from "../antd/AxCtrlAdvanced"
import { MxCheckBox, MxInputNumber, MxInputPassword, MxInputText, MxMultiCheckBox, MxRadioBox, MxSelectBox, MxSelectNumberBox, MxTextArea } from "../mui/MxCtrl"
const { AxCheckBox, AxInputNumber, AxInputPassword, AxRadioBox, AxSelectBox, AxTextArea, AxInputText } = Antd


export interface CxLayoutProps {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24
  componentType: "standard" | "antd" | "mui" | "fluent"
}

export const CxTableLayout: React.FC<CxLayoutProps> = (props: CxLayoutProps) => {
  const v = props.view
  const items: CsItemBase[] = []
  for (const value of Object.values(v)) {
    if (value instanceof CsItemBase) {
      items.push(value)
    }
  }
  const rowLimit = Math.floor(items.length / props.colSize + ((items.length % props.colSize === 0) ? 0 : 1))
  const rows: number[] = []
  for (let i = 0; i < rowLimit; i++) {
    rows.push(i + 1)
  }
  const cols: number[] = []
  for (let i = 0; i < props.colSize; i++) {
    cols.push(i + 1)
  }
  const colSpan = 24 / props.colSize
  let x = 0
  let k = 0
  return (
    <>
      {
        rows.map((r) => {
          return (
            <Row key={k++}>
              {
                cols.map((c) => {
                  return (
                    <Col key={k++} span={colSpan}>
                      {
                        <SelectComponent key={k++} item={items[x++]} componentType={props.componentType} />
                      }
                    </Col>
                  )
                })
              }
            </Row>
          )
        }
        )
      }
    </>
  )
}

export const selectComponent = (item: CsItemBase, componentType: "standard" | "antd" | "mui" | "fluent"): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: CxProps<CsInputTextItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxInputText {...props} />)
      case "mui":
        return (<MxInputText  {...props} />)
      default:
        return (<AxInputText {...props} />)
    }
  }
  if (item instanceof CsInputNumberItem) {
    const props: CxProps<CsInputNumberItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxInputNumber {...props} />)
      case "mui":
        return (<MxInputNumber {...props} />)
      default:
        return (<AxInputNumber {...props} />)
    }
  }
  if (item instanceof CsTextAreaItem) {
    const props: CxProps<CsTextAreaItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxTextArea {...props} />)
      case "mui":
        return (<MxTextArea {...props} />)
      default:
        return (<AxTextArea {...props} />)
    }
  }
  if (item instanceof CsCheckBoxItem) {
    const props: CxProps<CsCheckBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxCheckBox {...props} />)
      case "mui":
        return (<MxCheckBox {...props} />)
      default:
        return (<AxCheckBox {...props} />)
    }
  }
  if (item instanceof CsInputPassword) {
    const props: CxProps<CsInputPassword> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxPasswordBox {...props} />)
      case "mui":
        return (<MxInputPassword {...props} />)
      default:
        return (<AxInputPassword {...props} />)
    }
  }
  if (item instanceof CsRadioBoxItem) {
    const props: CxProps<CsRadioBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxRadioBox {...props} />)
      case "mui":
        return (<MxRadioBox {...props} />)
      default:
        return (<AxRadioBox {...props} />)
    }
  }
  if (item instanceof CsSelectBoxItem<number>) {
    const props: CxProps<CsSelectNumberBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "mui":
        return (<MxSelectNumberBox {...props} />)
      default:
        return (<AxSelectNumberBox {...props} />)
    }
  }
  if (item instanceof CsSelectBoxItem<string>) {
    const props: CxProps<CsSelectBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxSelectBox {...props} />)
      case "mui":
        return (<MxSelectBox {...props} />)
      default:
        return (<AxSelectBox {...props} />)
    }
  }
  if (item instanceof CsMultiCheckBoxItem) {
    const props: CxProps<CsMultiCheckBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "mui":
        return (<MxMultiCheckBox {...props} />)
      default:
        return (<AxMultiCheckBox {...props} />)
    }
  }
  if (item instanceof CsInputDateItem) {
    const props: CxProps<CsInputDateItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "mui":
        return (<NullElement />)
      default:
        return (<AxInputDate {...props} />)
    }
  }
  if (item instanceof CsInputNumberRangeItem) {
    const props: CxProps<CsInputNumberRangeItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "mui":
        return (<NullElement />)
      default:
        return (<AxInputNumberRange {...props} />)
    }
  }
  return <NullElement />
}

const NullElement = () => {
  return <div></div>;
}

const SelectComponent: React.FC<{ item: CsItemBase, componentType: "standard" | "antd" | "mui" | "fluent" }> = (props) => {
  return selectComponent(props.item, props.componentType)
}