import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AsIsWayPane } from '../parts/AsIsWayPane';
import { TestTabXPane } from '../parts/TestTabXPane';
import { AxSelectNumberBox } from '../antd/AxCtrl';
import { numValOpt, selectOptNum, useCsSelectNumberBoxItem } from '../../framework/cs/CsHooks';
import { TestEventPane } from '../parts/TestEventPane';

const TestTab: React.FC = () => {
  const colSize = useCsSelectNumberBoxItem("表示列数", useState(2), numValOpt(false),
    selectOptNum([1, 2, 3, 4, 6]))
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `現状の実装`,
      children: <AsIsWayPane />,
    },
    {
      key: '2',
      label: `x列の自動デザイン（標準）`,
      children: <TestTabXPane colSize={colSize.value ?? 1} componentType="standard" />,
    },
    {
      key: '3',
      label: `x列の自動デザイン（Ant Design）`,
      children: <TestTabXPane colSize={colSize.value ?? 1} componentType="antd" />,
    },
    {
      key: '4',
      label: `x列の自動デザイン（Fluent UI）`,
      children: <TestTabXPane colSize={colSize.value ?? 1} componentType="fluent" />,
    },
    {
      key: '5',
      label: `イベントテスト（ReactQuery ⁺ Ant Design）`,
      children: <TestEventPane colSize={colSize.value ?? 1} componentType="antd" />,
    },
  ];
  return (
    <>
      <AxSelectNumberBox item={colSize} />
      <Tabs defaultActiveKey="1" items={items} />
    </>
  )
}

export default TestTab;

function valOpt(arg0: boolean): any {
  throw new Error('Function not implemented.');
}
