import React, { useState } from 'react';
import { Row, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AsIsWayPane } from '../parts/AsIsWayPane';
import { TestTabXPane } from '../parts/TestTabXPane';
import { AxCheckBox, AxSelectNumberBox } from '../../framework/antd/AxCtrl';
import { numberRule, selectOptionNumbers, useCsCheckBoxItem, useCsSelectNumberBoxItem, useInit } from '../../framework/cs/CsHooks';
import { TestEventPane } from '../parts/TestEventPane';
import { useTestView, useTestZodView } from '../parts/testView';

const TestTab: React.FC = () => {
  const colSize = useCsSelectNumberBoxItem("表示列数", useInit(2), numberRule(false),
    selectOptionNumbers([1, 2, 3, 4, 6]))
  const readonlyCheck = useCsCheckBoxItem("読み取り専用", useInit(false), "する")
  const riView = useTestView()
  const zodView = useTestZodView()
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
        view={zodView}
        colSize={colSize.value ?? 1}
        componentType="standard"
        readonly={readonlyCheck.value === true} />,
    },
    {
      key: '3',
      label: `x列の自動デザイン（Ant Design）`,
      children: <TestTabXPane
        view={riView}
        colSize={colSize.value ?? 1}
        componentType="antd"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: '4',
      label: `x列の自動デザイン（Material UI）`,
      children: <TestTabXPane
        view={riView}
        colSize={colSize.value ?? 1}
        componentType="mui"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: '5',
      label: `x列の自動デザイン（React bootstrap）`,
      children: <TestTabXPane
        view={zodView}
        colSize={colSize.value ?? 1}
        componentType="bootstrap"
        readonly={readonlyCheck.value ?? false} />,
    },
    {
      key: '6',
      label: `イベントテスト（ReactQuery ⁺ Ant Design）`,
      children: <TestEventPane
        colSize={colSize.value ?? 1}
        componentType="antd" />,
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <AxSelectNumberBox item={colSize} />
        <AxCheckBox item={readonlyCheck} />
      </Row>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TestTab;
