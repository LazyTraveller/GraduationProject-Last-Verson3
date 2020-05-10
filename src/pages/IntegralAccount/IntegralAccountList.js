import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Badge, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getApplyColumns from './IntegralAccountTable';
import { isNull } from 'util';

@connect(({ IntegralAccount, loading }) => ({
  IntegralAccount, // 这里要改
  isSaving: loading.effects['IntegralAccount/fetchintegralaccountList'],// 这里要改
  loading: loading.models.IntegralAccount,
}))
@Form.create()
class IntegralAccount extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formValues: {},
      pagination: {},
    }
  }

  componentDidMount() {
    this.query();
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValues) => {
      if (err) return;
      this.query({ phone: fieldsValues.phone, wechatName: fieldsValues.wechatName })
      this.setState({
        formValues: { ...fieldsValues },
      });
      // dispatch({
      //   type: 'IntegralAccount/Queryintegralaccount',
      //   payload: { ...fieldsValues }
      // });
    }); 
  }

  requery = () => {
    this.query();
  }


  query(params = {}) {
    this.clearError();
    const { dispatch } = this.props;
    if (params.hasOwnProperty('number') === false) {
      params.number = 10;
    }
    if (params.hasOwnProperty('page') === false) {
      params.page = 1;
    }
    dispatch({
      type: 'IntegralAccount/fetchintegralaccountList',
       payload: { ...params  }
    })
  }

  clearError() { this.setState({ error: ''})}

  handleTableChange = (pagination, filter, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.query({
      number: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sorterOrder: sorter.order,
      ...filter
    });  
  }

  render() {
    const { isSaving, IntegralAccount, loading,form } = this.props;
    const { error, pagination } = this.state;
    const listData = Array.isArray(IntegralAccount.integralaccountListlist) > 0 ? IntegralAccount.integralaccountListlist : [];
    const count = _.get(listData[0], 'count');
    pagination.total = count;
    // console.warn('count', _.get(listData[0], 'count'))
    
    // let count = 0;
    // let Applylist1 = [];
    // integralaccountListlist.map(it => {
    //   if (_.get(it, 'status') === false) {
    //     count++;
    //   }
    //   if (_.get(it, 'status') === true) {
    //     Applylist1.push(it);
    //   }
    // });


   
    const tableColumns = getApplyColumns(
      { IntegralAccount },
      { 
        clearError: this.clearError.bind(this),
      }
    );

    const submitText = (
      <div style={{ marginTop: 43 }}>
        <Col md={8} sm={24}>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>查询</Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
          <Button style={{ marginLeft: 10 }} onClick={this.requery}>刷新</Button>
        </Col>
      </div>
    );

    const renderClassifyFilter = (
      <Form onSubmit={this.handleSearch} layout='horizontal' style={{ marginBottom: 30}}>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="会员电话筛选">
              {form.getFieldDecorator('phone', {
                rules: [
                  { message: '请输入需要查询的会员电话'}
                ]
              })(<Input placeholder="填写会员电话" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="微信名称筛选">
              {form.getFieldDecorator('wechatName', {
                rules: [
                  { message: '请输入需要查询的微信名称'}
                ]
              })(<Input placeholder="微信名称关键字" />)}
            </Form.Item>
          </Col>
          {submitText}
        </Row>
      </Form>
    );


 
    return (
       <PageHeaderWrapper title="" content='' loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />会员人数列表</span>} error={error}>
          {renderClassifyFilter}
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={listData}
            pagination={pagination}
            onChange={this.handleTableChange}
            size="middle"
            expandedRowRender={record => <div><p>二维码ID：{record.Qrcode_id}</p><br /><p>微信openid：{record.openid ? record.openid: <span>无</span> }</p></div>}
            components={this.components}
          />
           {/* <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            defaultPageSize={10}
            total={count}
            showTotal={() => ('共' + count + '条数据')}
          /> */}
        </Card>
       
       </PageHeaderWrapper>
    );
  }

}
export default IntegralAccount;



