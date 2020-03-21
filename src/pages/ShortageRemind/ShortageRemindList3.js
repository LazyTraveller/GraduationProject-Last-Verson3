import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Badge, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getRemindColumns from './ShortageRemindTable3'

const defaultGoBack = {
  router: '/ShortageRemind/AddShortageRemind',
  title: '去上添加提醒',
}

@connect(({ ShortageRemind, loading }) => ({
  ShortageRemind, // 这里要改
  isSaving: loading.effects['ShortageRemind/fetchRemindList'],// 这里要改
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
    const { isSaving, ShortageRemind, loading } = this.props;
    const { error } = this.state;
    const remindlist = Array.isArray(ShortageRemind.remindlist) > 0 ? ShortageRemind.remindlist : [];
    let count = 0;
    let remindlist1 = []
    remindlist.map(it => {
    //   if (_.get(it, 'status') === false && _.get(it, 'remind') === '零食推荐') {
    //     count++;
    //   }
      if (_.get(it, 'remind') === '零食推荐' && _.get(it, 'status') === true) {
        remindlist1.push(_.pick(it, 'address', 'remind', 'textarea', 'status', 'uuid', 'time'))
       }
    });

    const content = (
      <Button
        type="primary"
        onClick={ev => {ev.preventDefault(); easyRouteTo(this,defaultGoBack.router)}} 
      >
        <Icon type="left" />{defaultGoBack.title}
      </Button>
    )

   
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
    //   <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />已处理零食推荐列表---总数{remindlist1.length}条</span>} extra={extra}>
          <Row gutter={16}>
            {/* <Col md={10} sm={24}>
              <span style={{ color: '#e60000',}}><Icon type="twitter" />&nbsp;&nbsp;未处理提醒总数：<Badge count={count} />&nbsp;请及时处理</span>
            </Col> */}
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
    //   </PageHeaderWrapper>
    );
  }

}
export default ShortageRemindList;



