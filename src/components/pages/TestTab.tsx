import React from "react"
import { Row, Tabs } from "antd"
import type { TabsProps } from "antd"
import { AsIsWayPane } from "../parts/AsIsWayPane"
import { TestTabXPane } from "../parts/TestTabXPane"
import { AxCheckBox, AxRadioBox, AxSelectNumberBox } from "../../framework/components/antd"
import { numberRule, selectOptionNumbers, selectOptions, stringRule, useCsCheckBoxItem, useCsRadioBoxItem, useCsSelectNumberBoxItem, useInit } from "../../framework/logics"
import { TestEventPane } from "../parts/TestEventPane"

const TestTab: React.FC = () => {
  const colSize = useCsSelectNumberBoxItem("表示列数", useInit(2), numberRule(false),
    selectOptionNumbers([1, 2, 3, 4, 6]))
  const readonlyCheck = useCsCheckBoxItem("読み取り専用", useInit(false), "する")
  const viewType = useCsRadioBoxItem("バリデーションタイプ", useInit("ri"), stringRule(true),
    selectOptions([{ value: "ri", label: "参照実装" }, { value: "zod", label: "Zod" }]))

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `現状の実装`,
      children: <AsIsWayPane />,
    },
    {
      key: "2",
      label: `x列の自動デザイン`,
      children: <TestTabXPane
        viewType={viewType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="standard"
        readonly={readonlyCheck.value === true} />,
    },
    {
      key: "3",
      label: (<div>x列の自動デザイン<div>（Material UI）</div></div>),
      children: <TestTabXPane
        viewType={viewType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="mui"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "4",
      label: (<div>x列の自動デザイン<div>（Ant Design）</div></div>),
      children: <TestTabXPane
        viewType={viewType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="antd"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "5",
      label: (<div>x列の自動デザイン<div>（React-Bootstrap）</div></div>),
      children: <TestTabXPane
        viewType={viewType.value ?? ""}
        colSize={colSize.value ?? 1}
        componentType="bootstrap"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: "6",
      label: `イベントテスト（ReactQuery ⁺ Ant Design）`,
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
        <AxRadioBox item={viewType} />
      </Row>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TestTab
