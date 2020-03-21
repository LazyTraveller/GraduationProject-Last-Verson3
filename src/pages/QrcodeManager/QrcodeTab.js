import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import QrcodeList from './QrcodeList';
import QrcodeList2 from './QrcodeList2';
import QrcodeList3 from './QrcodeList3';
import QrcodeList4 from './QrcodeList4';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';

export default class QrcodeListTab extends PureComponent {
  render() {
  
    const headerAction = null;
    return (
      <PageHeaderWrapper title="" action={headerAction}>
        <Tabs defaultActiveKey="default" size="large">
          <Tabs.TabPane tab="所有宿舍绑定" key="default" style={{ marginTop: '1em' }}>
            <QrcodeList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="严重缺货宿舍" key="second">
            <QrcodeList2 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="有消费宿舍" key="four">
            <QrcodeList4 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未消费宿舍" key="third">
            <QrcodeList3 />
          </Tabs.TabPane>

        </Tabs>
      </PageHeaderWrapper>
    );
  }
}
