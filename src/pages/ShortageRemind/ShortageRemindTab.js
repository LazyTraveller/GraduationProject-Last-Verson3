import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import ShortageRemindList from './ShortageRemindList';
import ShortageRemindList2 from './ShortageRemindList2';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ShortageRemindList1 from './ShortageRemindList1';
import ShortageRemindList3 from './ShortageRemindList3';

export default class ShortageRemindTab extends PureComponent {
  render() {
    const headerAction = null;
    return (
      <PageHeaderWrapper title="" action={headerAction}>
        <Tabs defaultActiveKey="default" size="large">
          <Tabs.TabPane tab="未处理补货宿舍" key="default" style={{ marginTop: '1em' }}>
            <ShortageRemindList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已处理补货宿舍" key="default1" style={{ marginTop: '1em' }}>
            <ShortageRemindList2 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未处理零食推荐" key="second">
            <ShortageRemindList1 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已处理零食推荐" key="second1">
            <ShortageRemindList3 />
          </Tabs.TabPane>
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}
