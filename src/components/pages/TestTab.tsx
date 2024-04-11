import React from "react"
import { Row, Tabs } from "antd"
import type { TabsProps } from "antd"
import { OldFashionededPane } from "../parts/OldFashionedPane"
import { TestTabXPane } from "../parts/TestTabXPane"
import { AxCheckBox, AxRadioBox, AxSelectNumberBox } from "../../framework/components/antd"
import { numberRule, selectOptionNumbers, selectOptions, stringRule, useCsCheckBoxItem, useCsRadioBoxItem, useCsSelectNumberBoxItem, useInit } from "../../framework/logics"
import { TestEventPane } from "../parts/TestEventPane"
import { ConceptApplyedPane } from "../parts/ConceptApplyedPane"

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
        colSize={colSize.value ?? 1}
        componentType="mui"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "4",
      label: (<div>x列の自動デザイン<div>（Ant Design）</div></div>),
      children: <TestTabXPane
        validationType={validationType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="antd"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "5",
      label: (<div>x列の自動デザイン<div>（React-Bootstrap）</div></div>),
      children: <TestTabXPane
        validationType={validationType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="bootstrap"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "6",
      label: (<div><div>イベントテスト</div>（React- Query＋Ant Design）</div>),
      children: <TestEventPane
        colSize={colSize.value ?? 1}
        componentType="antd" />,
    },
  ]
  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <AxSelectNumberBox item={colSize} />
        <AxCheckBox item={readonlyCheck} />
        <AxRadioBox item={validationType} />
      </Row>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TestTab
