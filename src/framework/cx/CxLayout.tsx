import React from "react"
import { Col, Row } from "antd"
import Antd from "../../components/antd"
import { CsCheckBoxItem, CsItemBase, CsInputPassword, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem, CsView, CsInputNumberItem } from "../cs"
import { CxCheckBox, CxInputNumber, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxInputText } from "./CxCtrl"
import { CsMultiCheckBoxItem, CsSelectNumberBoxItem } from "../cs/CsItem"
import { AxMultiCheckBox } from "../../components/antd/AxCtrl"
import { CsInputDateItem } from "../cs/CsItemAdvanced"
import { AxInputDate } from "../../components/antd/AxCtrlAdvanced"
const { AxCheckBox, AxInputNumber, AxInputPassword, AxRadioBox, AxSelectBox, AxTextArea, AxInputText } = Antd


export interface CxLayoutProps {
  view: CsView
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24
  componentType: "standard" | "antd" | "fluent"
}

export const CxTableLayout: React.FC<CxLayoutProps> = (props) => {
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

export const selectComponent = (item: CsItemBase, componentType: "standard" | "antd" | "fluent"): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: CxProps<CsInputTextItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxInputText {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxInputText {...props} />)
    }
  }
  if (item instanceof CsInputNumberItem) {
    const props: CxProps<CsInputNumberItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxInputNumber {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxInputNumber {...props} />)
    }
  }
  if (item instanceof CsTextAreaItem) {
    const props: CxProps<CsTextAreaItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxTextArea {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxTextArea {...props} />)
    }
  }
  if (item instanceof CsCheckBoxItem) {
    const props: CxProps<CsCheckBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxCheckBox {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxCheckBox {...props} />)
    }
  }
  if (item instanceof CsInputPassword) {
    const props: CxProps<CsInputPassword> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxPasswordBox {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxInputPassword {...props} />)
    }
  }
  if (item instanceof CsRadioBoxItem) {
    const props: CxProps<CsRadioBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxRadioBox {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxRadioBox {...props} />)
    }
  }
  if (item instanceof CsSelectBoxItem<number>) {
    const props: CxProps<CsSelectNumberBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxSelectBox<number> {...props} />)
    }
  }
  if (item instanceof CsSelectBoxItem<string>) {
    const props: CxProps<CsSelectBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<CxSelectBox {...props} />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxSelectBox {...props} />)
    }
  }
  if (item instanceof CsMultiCheckBoxItem) {
    const props: CxProps<CsMultiCheckBoxItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxMultiCheckBox {...props} />)
    }
  }
  if (item instanceof CsInputDateItem) {
    const props: CxProps<CsInputDateItem> = { item: item }
    switch (componentType) {
      case "standard":
        return (<NullElement />)
      case "fluent":
        return (<NullElement />)
      default:
        return (<AxInputDate {...props} />)
    }
  }
  return <NullElement />
}

const NullElement = () => {
  return <div></div>;
}

const SelectComponent: React.FC<{ item: CsItemBase, componentType: "standard" | "antd" | "fluent" }> = (props) => {
  return selectComponent(props.item, props.componentType)
}