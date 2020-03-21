import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import ApplicationBoxList from './ApplicationBoxList';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ApplicationBoxList1 from './ApplicationBoxList1';

export default class ShortageRemindTab extends PureComponent {
  render() {
    const headerAction = null;
    return (
      <PageHeaderWrapper title="" action={headerAction}>
        <Tabs defaultActiveKey="default" size="large">
          <Tabs.TabPane tab="未处理盒子申请" key="default" style={{ marginTop: '1em' }}>
            <ApplicationBoxList1 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已处理盒子申请" key="second">
            <ApplicationBoxList />
          </Tabs.TabPane>
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}
