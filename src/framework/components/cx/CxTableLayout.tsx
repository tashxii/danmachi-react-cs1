import React from "react"
import { Col, Row } from "antd"
import { CsCheckBoxItem, CsItemBase, CsInputPassword, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem, CsView, CsInputNumberItem } from "../../logics"
import { CxCheckBox, CxInputNumber, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxInputText } from "./CxCtrl"
import { CsMultiCheckBoxItem, CsSelectNumberBoxItem } from "../../logics"
import { AxCheckBox, AxInputNumber, AxInputPassword, AxInputText, AxMultiCheckBox, AxRadioBox, AxSelectBox, AxSelectNumberBox, AxTextArea } from "../antd"
import { CsInputDateItem, CsInputNumberRangeItem } from "../../logics"
import { MxCheckBox, MxInputNumber, MxInputPassword, MxInputText, MxMultiCheckBox, MxRadioBox, MxSelectBox, MxSelectNumberBox, MxTextArea } from "../mui/MxCtrl"
import { BSxCheckBox, BSxInputNumber, BSxInputPassword, BSxInputText, BSxMultiCheckBox, BSxRadioBox, BSxSelectBox, BSxSelectNumberBox, BSxTextArea } from "../bootstrap/BSxCtrl"
import { BSxInputDate, BSxInputNumberRange } from "../bootstrap/BSxCtrlAdvanced"
import { MxInputDate, MxInputNumberRange } from "../mui/MxCtrlAdvanced"
import { AxInputDate, AxInputNumberRange } from "../antd"


export interface CxLayout2Props {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24
  componentType: "standard" | "antd" | "mui" | "bootstrap"
}

export const CxTableLayout: React.FC<CxLayout2Props> = (props: CxLayout2Props) => {
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

export const selectComponent = (item: CsItemBase, componentType: "standard" | "antd" | "mui" | "bootstrap"): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: CxProps<CsInputTextItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxInputText {...props} />)
      case "mui":
        return (<MxInputText  {...props} />)
      case "bootstrap":
        return (<BSxInputText  {...props} />)
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
      case "bootstrap":
        return (<BSxInputNumber  {...props} />)
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
      case "bootstrap":
        return (<BSxTextArea  {...props} />)
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
      case "bootstrap":
        return (<BSxCheckBox  {...props} />)
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
      case "bootstrap":
        return (<BSxInputPassword  {...props} />)
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
      case "bootstrap":
        return (<BSxRadioBox  {...props} />)
      default:
        return (<AxRadioBox {...props} />)
    }
  }
  if (item instanceof CsSelectNumberBoxItem) {
    const props: CxProps<CsSelectNumberBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "mui":
        return (<MxSelectNumberBox {...props} />)
      case "bootstrap":
        return (<BSxSelectNumberBox {...props} />)
      default:
        return (<AxSelectNumberBox {...props} />)
    }
  }
  if (item instanceof CsSelectBoxItem) {
    const props: CxProps<CsSelectBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxSelectBox {...props} />)
      case "mui":
        return (<MxSelectBox {...props} />)
      case "bootstrap":
        return (<BSxSelectBox  {...props} />)
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
      case "bootstrap":
        return (<BSxMultiCheckBox  {...props} />)
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
        return (<MxInputDate  {...props} />)
      case "bootstrap":
        return (<BSxInputDate {...props} />)
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
        return (<MxInputNumberRange {...props} />)
      case "bootstrap":
        return (<BSxInputNumberRange {...props} />)
      default:
        return (<AxInputNumberRange {...props} />)
    }
  }
  return <NullElement />
}

const NullElement = () => {
  return <div></div>;
}

const SelectComponent: React.FC<{ item: CsItemBase, componentType: "standard" | "antd" | "mui" | "bootstrap" }> = (props) => {
  return selectComponent(props.item, props.componentType)
}