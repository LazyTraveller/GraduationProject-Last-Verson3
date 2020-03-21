import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Badge, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getApplyColumns from './IntegralAccountTable';


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
      current: 1,
      pageSize: 10,
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
      if (fieldsValues.address === undefined) {
        this.query();
      }
      this.setState({
        formValues: { ...fieldsValues },
      });
      dispatch({
        type: 'IntegralAccount/Queryintegralaccount',
        payload: { ...fieldsValues }
      });
    }); 
  }

  requery = () => {
    this.query();
  }


  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'IntegralAccount/fetchintegralaccountList',
       payload: { page: this.state.current, number: this.state.pageSize  }
    })
  }

  clearError() { this.setState({ error: ''})}

  onShowSizeChange = (current, pageSize) => {
    console.warn(current, pageSize);
    this.setState(function(){
      return {
        pageSize: pageSize,
        current: current
      }
    });
    this.query();
  }

  render() {
    const { isSaving, IntegralAccount, loading,form } = this.props;
    const { error } = this.state;
    const listData = Array.isArray(IntegralAccount.integralaccountListlist) > 0 ? IntegralAccount.integralaccountListlist : [];
    const count = _.get(listData[0], 'count');
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
            <Form.Item label="宿舍号筛选">
              {form.getFieldDecorator('address', {
                rules: [
                  { message: '请输入需要查询的宿舍号'}
                ]
              })(<Input placeholder="宿舍号关键字" />)}
            </Form.Item>
          </Col>
          {submitText}
        </Row>
      </Form>
    );


 
    return (
       <PageHeaderWrapper title="" content='' loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />会员人数--{listData.length}份</span>} error={error}>
          {renderClassifyFilter}
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={listData}
            // pagination={{"defaultPageSize":10, showQuickJumper: true }}
            size="middle"
            expandedRowRender={record => <div><p>二维码ID：{record.Qrcode_id}</p><br /><p>微信openid：{record.openid ? record.openid: <span>无</span> }</p></div>}
            components={this.components}
          />
           <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            defaultPageSize={10}
            total={count}
            showTotal={() => ('共' + count + '条数据')}
          />
        </Card>
       
       </PageHeaderWrapper>
    );
  }

}
export default IntegralAccount;



