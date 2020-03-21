import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getSnackColumns from './SnackTable';

const defaultGoBack = {
  router: '/SnacksManager/AddSnacks',
  title: '去上架零食',
}

@connect(({ snacks, loading }) => ({
  snacks, // 这里要改
  isSaving: loading.effects['snacks/fetchSnackList'],// 这里要改
  loading: loading.models.snacks,
}))
@Form.create()
class SnacksList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }



  componentDidMount() {
    this.query();
  }

  onDeleteSnack(it) {
    if (!it) return;
    this.clearError();
    const { dispatch } = this.props;
   
    dispatch({
      type: 'snacks/fetchSanckDelete',
      payload: { uuid: it.uuid },
    });
    this.query();
  }

  onEditSubmit(values) {
    const { dispatch } = this.props;
    this.clearError();
    const sendValues = Object.assign({}, values);
    
    dispatch({
      type: 'snacks/fetchSnackEdit',
      payload: sendValues,
    })
  }

 

  getEditSnack(uuid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchSnacksByUUID',
      payload: uuid,
    })

  }

  requery = () => {
    this.query();
    message.success('刷新成功!');
  }


  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchSnackList'
    });
    dispatch({
      type: 'snacks/fetchclassifyList'
    });
  }

  clearError() {
    this.setState({ error: '' })
  }

  render() {
    const { isSaving, loading, snacks} = this.props;
    const { error } = this.state;
    const snackList = Array.isArray(snacks.snackList) ? snacks.snackList : [];

    const content = (
      <Button
        type="primary"
        onClick={ev => {ev.preventDefault(); easyRouteTo(this,defaultGoBack.router)}} 
      >
        <Icon type="left" />{defaultGoBack.title}
      </Button>
    )

    const tableColumns = getSnackColumns(
      { snacks },
      {
        onDeleteSnack: this.onDeleteSnack.bind(this),
        onEditSubmit: this.onEditSubmit.bind(this),
        clearError: this.clearError.bind(this),
        getEditSnack: this.getEditSnack.bind(this),
      },
    );

    const extra = (
      <Button type="primary" style={{ marginLeft: 10 }} onClick={this.requery}>刷新</Button>
    );
 
    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="unordered-list" />&nbsp;零食列表---总数{snackList.length}件</span>} style={{ marginBottom: 30 }} error={error} extra={extra}>
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={snackList}
            pagination={{"defaultPageSize": 10, showQuickJumper: true }}
            size='middle'
            components={this.components}
            style={{ marginTop: 10 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default SnacksList;



