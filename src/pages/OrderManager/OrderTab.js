import { Tabs, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import OrderList from './OrderList';
import PendingList from './PendingList';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';

export default class OrderTab extends PureComponent {
    render() {
        const headerAction = null;
        return (
          <PageHeaderWrapper title='' action={headerAction}>
            <Tabs defaultActiveKey="default" size="large">
              <Tabs.TabPane tab="未处理订单" key="default" style={{ marginTop: '1em' }}>
                <OrderList />
              </Tabs.TabPane>
              <Tabs.TabPane tab="已处理订单" key="second">
                <PendingList />
              </Tabs.TabPane>
            </Tabs>
          </PageHeaderWrapper>
         
        );
    }
}