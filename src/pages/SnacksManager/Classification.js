import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button , message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import EditClassify from './modals/EditClassify';

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
  title: '零食列表',
}

function getColumns(props, eventHandler) {
  const { getEditClassify,clearError, onEditSubmit} = eventHandler;
  return [
    newColumn('零食分类uuid', 'uuid'),
    newColumn('分类名称', 'name'),
    {
      title: '添加时间',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      sorter: (a,b) => Date.parse(a.time) - Date.parse(b.time),
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
              title={<span>确认删除<b>{it.name}</b>分类吗？<br /></span>}
              okType="danger"
              onConfirm={eventHandler.onDeleteclassify.bind(null, it)}
              okText="确认删除"
              cancelText="按错"
            >
              <a style={{ color: '#FC1E39', marginLeft: 20 }}>
                <Icon type="delete" />&nbsp;删除
              </a>
            </Popconfirm>
            <EditClassify
              onShowAsync={clearError}
              onOk={onEditSubmit}
            >
              <a
                style={{ marginLeft: 50 }}
                onClick={getEditClassify.bind(this, _.get(it, 'uuid', ''))}
              ><Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;
              </a>
            </EditClassify>


          </Fragment>
        )
      }
    }
  ];

}

@connect(({ snacks, loading }) => ({
  snacks, // 这里要改
  isSaving: loading.effects['snacks/fetchclassifyList'],// 这里要改
  loading: loading.models.snacks,
}))
@Form.create()
class Classification extends Component{
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

  onDeleteclassify(it) {
    if (!it) return;
    this.clearError();
   
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchclassifyDelete',
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
        type: 'snacks/fetchclassifyAdd',
        payload: sendValues.name,
      });
      this.query();
    });
  }

  onEditSubmit(values) {
    const { dispatch } = this.props;
    this.clearError();
    const sendValues = Object.assign({}, values);
   
    dispatch({
      type: 'snacks/fetchclassifyEdit',
      payload: sendValues,
    });
    this.query();
    
  }

  getEditClassify(uuid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchclassifybyUUID',
      payload: uuid
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
    message.success('刷新成功!');
  }

 

  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchclassifyList',
    });
  }

  clearError() { this.setState({ error: '' }); }



  render() {
    const { form, loading ,snacks, isSaving} = this.props;
    const classifylist = Array.isArray(snacks.classifylist) > 0 ? snacks.classifylist : [];
    const { error } = this.state;
    const tableColumns = getColumns(
      { snacks },
      {
        onDeleteclassify: this.onDeleteclassify.bind(this),
        getEditClassify: this.getEditClassify.bind(this),
        clearError: this.clearError.bind(this),
        onEditSubmit: this.onEditSubmit.bind(this),
        
      }
    );
    const extraContent = "";
    const content = (
      <Button
        type="primary"
        icon="left"
        onClick={ev => {ev.preventDefault(); easyRouteTo(this, defaultGoBack.router); }}

      >
        {defaultGoBack.title}
      </Button>
    );

    const extra = (
      <Button type="primary" style={{ marginLeft: 10 }} onClick={this.requery}>刷新</Button>
    );

    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={extraContent}>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;添加零食分类</span>} style={{ marginBottom: 30 }}>
          <Row gutter={16}>
            <Col lg={8} md={8} sm={24}>
              <Form.Item label="分类名称">
                {form.getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '分类名称不为空'}
                  ]
                })(
                  <Input placeholder="请编辑零食分类" />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={24}>
              <div style={{ marginTop: 43 }}>
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
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title={<span><Icon type="ordered-list" />&nbsp;零食分类列表--总数{classifylist.length}种</span>} extra={extra}>
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={classifylist}
            pagination={{"defaultPageSize": 10, showQuickJumper: true }}
            size="middle"
            components={this.components}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default Classification;



