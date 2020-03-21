import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Table, Button, Badge, message } from 'antd';
import getRemindColumns from './ShortageRemindTable'

@connect(({ ShortageRemind, loading }) => ({
  ShortageRemind, 
  isSaving: loading.effects['ShortageRemind/fetchRemindList'],
  loading: loading.models.ShortageRemind,
}))
@Form.create()
class ShortageRemindList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  componentDidMount() {
    this.query();
  }

  onDeleteRemind(it) {
    if (!it) return;
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'ShortageRemind/fetchRemindDelete',
      payload: { uuid: it.uuid },
    });
    this.query();
  }


  onMarkRemind(uuid) {
    const { dispatch } = this.props;
   
    dispatch({
      type: 'ShortageRemind/fetchMarkRemind',
      payload: { uuid },
    });
    this.query();
  }

  requery = () => {
    this.query();
    message.success('刷新成功!');
  }

  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'ShortageRemind/fetchRemindList'
    })
  }
 
  clearError() { this.setState({ error: ''})}


  render() {
    const { ShortageRemind, loading } = this.props;
    const remindlist = Array.isArray(ShortageRemind.remindlist) > 0 ? ShortageRemind.remindlist : [];
    let count = 0;
    let remindlist1 = [];
    remindlist.map(it => {
      if (_.get(it, 'status') === false && _.get(it, 'remind') === '缺货提醒') {
        count++;
      };
     if (_.get(it, 'remind') === '缺货提醒' && _.get(it, 'status') === false) {
      remindlist1.push(_.pick(it, 'address', 'remind', 'sex', 'status', 'uuid', 'time'))
     }
    });


    const tableColumns = getRemindColumns(
      { ShortageRemind },
      { 
        onMarkRemind: this.onMarkRemind.bind(this),
        onDeleteRemind: this.onDeleteRemind.bind(this),
      }
    );

    const extra = (
      <Button type="primary" style={{ marginLeft: 10 }} onClick={this.requery}>刷新</Button>
    );
   
    return (
      // <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />缺货提醒列表</span>} extra={extra}>
          <Row gutter={16}>
            <Col md={10} sm={24}>
              <span style={{ color: '#e60000',}}><Icon type="twitter" />&nbsp;&nbsp;未处理提醒总数：<Badge count={count} />&nbsp;请及时处理</span>
            </Col>
          </Row>
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={remindlist1}
            pagination={{"defaultPageSize":10, showQuickJumper: true }}
            size="middle"
            components={this.components}
            style={{ marginTop: 30}}
            scroll={{ x: 1100 }}
          />
        </Card>
      // </PageHeaderWrapper>
    );
  }

}
export default ShortageRemindList;



