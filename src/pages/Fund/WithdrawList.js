import React, { Component } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Card, Icon, Form, Table,Button } from 'antd';
import getFundColumns from './WithdrawListTable';
import { easyRouteTo } from '../../utils/easyDispatch';


const URL = 'https://www.eyuwu.cn/zhuhaiweb';
@connect(({ fund, loading }) => ({
  fund,
  isSaving: loading.effects['fund/fetchWithdrawList'],
  loading: loading.models.fund,
}))
@Form.create()
class WithdrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
  }

  componentDidMount() {
    this.query();
  }


  requery = () => {
    this.query();
  };


  
  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'fund/fetchWithdrawList',
    });
  }

  OnMarkFund(uuid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'fund/fetchOnMarkFund',
      payload: { uuid },
    });
    this.query();
  }

  

  clearError() {
    this.setState({ error: '' });
  }

  render() {
    const { fund, loading } = this.props;
    const { error } = this.state;
    const WithdrawList1 = Array.isArray(fund.WithdrawList) > 0 ? fund.WithdrawList : [];

    const tableColumns = getFundColumns(
      { fund },
      {
        clearError: this.clearError.bind(this),
        OnMarkFund: this.OnMarkFund.bind(this),
      }
    );

    const extra = (
      <Button type="primary" style={{ marginLeft: 10 }} onClick={this.requery}>
        刷新
      </Button>
    );

    return (
      <div>
        <Card
          bordered={false}
          title={
            <span>
              <Icon type="unordered-list" />
              申请提现记录列表
            </span>
          }
          error={error}
          extra={extra}
        >
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={WithdrawList1}
            pagination={{ defaultPageSize: 10, showQuickJumper: true }}
            size="middle"
            components={this.components}
          />
        </Card>
      </div>
    );
  }
}
export default WithdrawList;
