import React, { useState } from "react"
import { Row, Tabs } from "antd"
import type { TabsProps } from "antd"
import { OldFashionededPane } from "../parts/OldFashionedPane"
import { TestTabXPane } from "../parts/TestTabXPane"
import { AxCheckBox, AxRadioBox, AxSelectBox, AxSelectNumberBox } from "../../framework/components/antd"
import { numberRule, selectOptionNumbers, selectOptions, stringRule, useCsCheckBoxItem, useCsRadioBoxItem, useCsSelectBoxItem, useCsSelectNumberBoxItem, useInit } from "../../framework/logics"
import { TestEventPane } from "../parts/TestEventPane"
import { ConceptApplyedPane } from "../parts/ConceptApplyedPane"
import PetInfoTable from "../parts/TestArrayDataView"

const TestTab: React.FC = () => {
  const colSize = useCsSelectNumberBoxItem("表示列数", useInit(2), numberRule(false),
    selectOptionNumbers([1, 2, 3, 4, 6]))
  const readonlyCheck = useCsCheckBoxItem("読み取り専用", useInit(false), "する")
  const validationType = useCsRadioBoxItem("バリデーションタイプ", useInit("yup"), stringRule(true),
    selectOptions([
      { value: "yup", label: "Yup" },
      { value: "zod", label: "Zod" },
      { value: "ri", label: "参照実装" },
    ]))
  const validationTrigger = useCsSelectBoxItem("バリデーションタイミング", useInit("onSubmit"), stringRule(true),
    selectOptions([
      { value: "onSubmit", label: "ボタンが押された時" },
      { value: "onBlur", label: "カーソルが離れた時" },
    ]))
  const labelType = useCsRadioBoxItem("ラベル位置", useInit("top"), stringRule(true),
    selectOptions([
      { value: "top", label: "上(top)" },
      { value: "left", label: "左(left)" },
      { value: "hidden", label: "ラベルなし" },
    ]))
  const labelWidth = useCsSelectNumberBoxItem("ラベル幅(位置が「左」のみ有効)", useInit(30), numberRule(true),
    selectOptionNumbers([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]))

  const [activeKey, setActiveKey] = useState("1")
  const isReadonly = activeKey !== "3" && activeKey !== "4" && activeKey !== "5" && activeKey !== "7"
  colSize.setReadonly(isReadonly)
  readonlyCheck.setReadonly(isReadonly)
  validationType.setReadonly(isReadonly)
  validationTrigger.setReadonly(isReadonly)
  labelType.setReadonly(isReadonly)
  labelWidth.setReadonly(isReadonly || labelType.value !== "left")
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `工夫無しの実装`,
      children: <OldFashionededPane />,
    },
    {
      key: "2",
      label: `コンセプトを適用した実装`,
      children: <ConceptApplyedPane />,
    },
    {
      key: "3",
      label: (<div>x列の自動デザイン<div>（Material UI）</div></div>),
      children: <TestTabXPane
        validationType={validationType.value ?? ""}
        validationTrigger={validationTrigger.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="mui"
        labelType={labelType.value ?? "top"}
        labelWidth={labelWidth.value ?? 30}
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "4",
      label: (<div>x列の自動デザイン<div>（Ant Design）</div></div>),
      children: <TestTabXPane
        validationType={validationType.value ?? ""}
        validationTrigger={validationTrigger.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="antd"
        labelType={labelType.value ?? "top"}
        labelWidth={labelWidth.value ?? 30}
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "5",
      label: (<div>x列の自動デザイン<div>（React-Bootstrap）</div></div>),
      children: <TestTabXPane
        validationType={validationType.value ?? ""}
        validationTrigger={validationTrigger.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="bootstrap"
        labelType={labelType.value ?? "top"}
        labelWidth={labelWidth.value ?? 30}
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "6",
      label: (<div><div>イベントテスト</div>（React- Query＋Ant Design）</div>),
      children: <TestEventPane
        colSize={colSize.value ?? 1}
        componentType="antd" />,
    },
    {
      key: "7",
      label: (<div><div>配列データテーブル</div>（ArrayDataTable）</div>),
      children: <PetInfoTable validationTrigger={validationTrigger.value ?? ""} />,
    },
  ]
  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <AxSelectNumberBox item={colSize} />
        <AxCheckBox item={readonlyCheck} />
        <AxRadioBox item={validationType} />
        <AxSelectBox item={validationTrigger} />
        <AxRadioBox item={labelType} />
        {true && <AxSelectNumberBox item={labelWidth} />}
      </Row>
      <Tabs defaultActiveKey="1" items={items} onChange={(key) => {
        setActiveKey(key)
      }} />
    </div>
  )
}

export default TestTab
