import React, { useState } from 'react';
import { Row, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AsIsWayPane } from '../parts/AsIsWayPane';
import { TestTabXPane } from '../parts/TestTabXPane';
import { AxCheckBox, AxSelectNumberBox } from '../antd/AxCtrl';
import { numberRule, optionNumbers, useCsCheckBoxItem, useCsSelectNumberBoxItem } from '../../framework/cs/CsHooks';
import { TestEventPane } from '../parts/TestEventPane';

const TestTab: React.FC = () => {
  const colSize = useCsSelectNumberBoxItem("表示列数", useState(2), numberRule(false),
    optionNumbers([1, 2, 3, 4, 6]))
  const readonlyCheck = useCsCheckBoxItem("読み取り専用", useState(false), "する")
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `現状の実装`,
      children: <AsIsWayPane />,
    },
    {
      key: '2',
      label: `x列の自動デザイン（標準）`,
      children: <TestTabXPane
        colSize={colSize.value ?? 1}
        componentType="standard"
        readonly={readonlyCheck.value === true} />,
    },
    {
      key: '3',
      label: `x列の自動デザイン（Ant Design）`,
      children: <TestTabXPane
        colSize={colSize.value ?? 1}
        componentType="antd"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: '4',
      label: `x列の自動デザイン（Fluent UI）`,
      children: <TestTabXPane
        colSize={colSize.value ?? 1}
        componentType="fluent"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: '5',
      label: `イベントテスト（ReactQuery ⁺ Ant Design）`,
      children: <TestEventPane
        colSize={colSize.value ?? 1}
        componentType="antd" />,
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <AxSelectNumberBox item={colSize} showRequiredTag="none" />
        <AxCheckBox item={readonlyCheck} showRequiredTag="none" />
      </Row>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TestTab;
