import React, { Component } from 'react';
import { connect } from 'dva';
import axios from 'axios'
import { Card, Icon, Form, Table, Row, Col, Input, Button } from 'antd';
import getFundColumns from './fundListTable';
import { easyRouteTo } from '../../utils/easyDispatch';

const URL = 'https://www.eyuwu.cn/zhuhaiweb';
@connect(({ fund, loading }) => ({
  fund,
  isSaving: loading.effects['fund/fetchfundList'],
  loading: loading.models.fund,
}))
@Form.create()
class fundList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formValues: {},
    };
  }

  componentDidMount() {
    this.query();
  }


  requery = () => {
    this.query();
  };

  
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
  }

  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'fund/fetchfundList',
    });
  }

  

  clearError() {
    this.setState({ error: '' });
  }

  render() {
    const { fund, loading } = this.props;
    const { error} = this.state;
    const fundlist = Array.isArray(fund.fundlist) > 0 ? fund.fundlist : [];

    const tableColumns = getFundColumns(
      { fund },
      {
        clearError: this.clearError.bind(this),
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
              总订单金额
            </span>
          }
          error={error}
          extra={extra}
        >
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={fundlist}
            pagination={{ defaultPageSize: 10, showQuickJumper: true }}
            size="middle"
            components={this.components}
          />
        </Card>
      </div>
    );
  }
}
export default fundList;
