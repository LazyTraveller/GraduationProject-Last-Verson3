import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';


export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

function getDateTimeString(msTimeOrDate) {
  if (msTimeOrDate === null) return null;
  if (msTimeOrDate && typeof msTimeOrDate === 'object') {
    if ('format' in msTimeOrDate && typeof msTimeOrDate.format === 'function')
      return msTimeOrDate.format(DATE_TIME_FORMAT);

    if (msTimeOrDate instanceof Date) return moment(msTimeOrDate).format(DATE_TIME_FORMAT);
  }
  // @ts-ignore
  return moment(new Date(msTimeOrDate)).format(DATE_TIME_FORMAT);
}


function newColumn(title, dataIndex, render = undefined) {
  return { title, dataIndex, render, key: dataIndex }
}

const defaultGoBack = {
  router: '/SnacksManager/SnacksList',
  title: '零食商品列表',
}

function getColumns(props, eventHandler) {
  return [
    newColumn('公告信息', 'announcement'),
    newColumn('打折', 'discount'),
    // newColumn('寄存点','point'),
    {
      title: '下单时间',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      sorter: (a, b) => Date.parse(a.time) - Date.parse(b.time),
      render: it => {
        const m = moment(it);
        return (
          <span title={getDateTimeString(m)}>{m.format("YYYY-MM-DD")}&nbsp;({m.fromNow()})</span>
        )
     }
    },
    {
      align: 'right',
      title: `操作`,
      key: 'op',
      render: it => {
        return(
          <Fragment>
            <Popconfirm
              title={<span>确认删除该条目吗？<br /></span>}
              okType="danger"
              onConfirm={eventHandler.onDeleteOrder.bind(null, it)}
              okText="确认删除"
              cancelText="按错"
            >
              <a style={{ color: '#FC1E39', marginLeft: 20 }}>
                <Icon type="delete" />&nbsp;删除
              </a>
            </Popconfirm>
          </Fragment>
        )
      }
    }
  ];

}

@connect(({ issue, loading }) => ({
  issue, // 这里要改
  isSaving: loading.effects['issue/fetchIssueList'],// 这里要改
  loading: loading.models.issue,
}))
@Form.create()
class BasicProfile extends Component{
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

  onDeleteOrder(it) {
    if (!it) return;
    this.clearError();
   
    const { dispatch } = this.props;
    dispatch({
      type: 'issue/fetchIssueDelete',// 
      payload: { uuid: it.uuid },
    });
    this.query();
  }

  onSubmit() {
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({ 
        error: '' ,
        formValues: { ...values },
      });
      const sendValues = Object.assign({}, values);
      
      dispatch({
        type: 'issue/fetchIssueAdd',
        payload: sendValues,
      });
      this.query();
    });
  }

 

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
  }

  requery = () => {
    this.query();
    message.success('刷新成功')
  }

  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'issue/fetchIssueList',
    });
  }

  clearError() { this.setState({ error: '' }); }

  render() {
    const { form, loading ,issue, isSaving} = this.props;
    const showIssue = Array.isArray(issue.showIssue) > 0 ? issue.showIssue : [];
    const { error } = this.state;
    const tableColumns = getColumns(
      { issue },
      {
        onDeleteOrder: this.onDeleteOrder.bind(this),
      }
    );
    const extraContent = (
      <div>
        <Button
          icon="check"
          type='primary'
          disabled={!!isSaving || !!error}
          onClick={ev => { ev.preventDefault(); this.onSubmit();}}
        >
          确认添加
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
      </div>
    );
    const content = (
      <Button
        icon="left"
        type="primary"
        onClick={ev => {ev.preventDefault(); easyRouteTo(this, defaultGoBack.router); }}

      >
        {defaultGoBack.title}
      </Button>
    );

    const extra = (
      <Button type="primary" onClick={this.requery}>刷新</Button>
    );

    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={extraContent}>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;发布公告 / 自定义打折 </span>} style={{ marginBottom: 30 }}>
          <Row gutter={16}>
            <Col lg={8} md={8} sm={24}>
              <Form.Item label="编辑公告">
                {form.getFieldDecorator('announcement', {
                })(
                  <Input placeholder="请编辑公告" />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={24}>
              <Form.Item label="编辑折扣(不打折为1)">
                {form.getFieldDecorator('discount', {
                })(
                  <Input placeholder="请输入折扣" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title={<span><Icon type="ordered-list" />&nbsp;公告 / 打折 列表</span>} extra={extra}>
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={showIssue}
            pagination={{"defaultPageSize": 10, showQuickJumper: true }}
            size="middle"
            // expandedRowRender={record => <div><p style={{ margin: 0 }}>寄存点：{record.point}</p></div>}
            components={this.components}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default BasicProfile;



