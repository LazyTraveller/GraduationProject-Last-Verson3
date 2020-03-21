import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getApplyColumns from './ApplicationBoxTable';

const defaultGoBack = {
  router: '/ApplicationBox/AddApplicationBox',
  title: '去上申请盒子',
}

@connect(({ ApplicationBox, loading }) => ({
  ApplicationBox, // 这里要改
  isSaving: loading.effects['ApplicationBox/fetchApplyList'],// 这里要改
  loading: loading.models.ApplicationBox,
}))
@Form.create()
class ApplicationBoxList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formValues: {},
    }
  }

  componentDidMount() {
    this.query();
  }

  onDeleteApply(it) {
    if (!it) return;
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'ApplicationBox/fetchApplyDelete',
      payload: { uuid: it.uuid },
    });
    this.query();
  }


  onMarkApply(uuid) {
    const { dispatch } = this.props;
   
    dispatch({
      type: 'ApplicationBox/fetchApplyRemind',
      payload: { uuid },
    });
    this.query();
  }


  onEditSubmit(values) {
    const { dispatch } = this.props;
    const sendValues = Object.assign({}, values);
   
    dispatch({
      type: 'ApplicationBox/fetchApplyEdit',
      payload: sendValues,
    });
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
        type: 'ApplicationBox/fetchQueryApplyByAddress',
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
      type: 'ApplicationBox/fetchApplyList'
    })
  }

  clearError() { this.setState({ error: ''})}

 


  GetApplyEdit(uuid) {
    const { dispatch } = this.props;
    // console.warn('page uuid', uuid)
    dispatch({
      type: 'ApplicationBox/fetchApplyByUUID',
      payload: uuid
    })
  }

  render() {
    const { isSaving, ApplicationBox, loading,form } = this.props;
    const { error } = this.state;
    const Applylist = Array.isArray(ApplicationBox.Applylist) > 0 ? ApplicationBox.Applylist : [];
    
    let count = 0;
    let Applylist1 =[];
    Applylist.map(it => {
      if (_.get(it, 'status') === false) {
        count++;
        Applylist1.push(it);
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
   
    const tableColumns = getApplyColumns(
      { ApplicationBox },
      { 
        onMarkApply: this.onMarkApply.bind(this),
        onDeleteApply: this.onDeleteApply.bind(this),
        onEditSubmit: this.onEditSubmit.bind(this),
        clearError: this.clearError.bind(this),
        GetApplyEdit: this.GetApplyEdit.bind(this),
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
          <Col md={8} sm={24}>
            <span style={{ color: '#e60000'}}><Icon type="twitter" />&nbsp;&nbsp;未处理盒子申请总数：<Badge count={count} />
            </span>
          </Col>
        </Row>
      </Form>
    );
 
    return (
    //   <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />未处理盒子申请总数--{Applylist1.length}份</span>} error={error}>
          {renderClassifyFilter}
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={Applylist1}
            pagination={{"defaultPageSize":10, showQuickJumper: true }}
            size="middle"
            components={this.components}
          />
        </Card>
    //   </PageHeaderWrapper>
    );
  }

}
export default ApplicationBoxList;



