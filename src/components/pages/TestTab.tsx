import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import testView from '../parts/testView';
import { AsIsWayPane } from '../parts/AsIsWayPane';
import { TestTab1Pane } from '../parts/TestTab1Pane';
import { TestTab2Pane } from '../parts/TestTab2Pane';
import { TestTab2PaneA } from '../parts/TestTab2PaneA';
import { TestTab3PaneA } from '../parts/TestTab3PaneA';

const onChange = (key: string) => {
  console.log(key);
};


const TestTab: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `現状の実装`,
      children: <AsIsWayPane />,
    },
    {
      key: '2',
      label: `1列のデザイン（自動）`,
      children: <TestTab1Pane />,
    },
    {
      key: '3',
      label: `2列のデザイン（自動）`,
      children: <TestTab2Pane />,
    },
    {
      key: '4',
      label: `2列のデザイン（自動+Ant Design）`,
      children: <TestTab2PaneA />,
    },
    {
      key: '5',
      label: `x列のデザイン（自動+Ant Design）`,
      children: <TestTab3PaneA />,
    },

  ];

  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  )
}

export default TestTab;