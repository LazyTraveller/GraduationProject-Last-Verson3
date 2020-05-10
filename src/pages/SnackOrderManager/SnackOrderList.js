import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Layout, Drawer } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getQrcodeColumns from './SnackOrderTable'
import PiaChartModal from './modals/PiaChartModal';
import { isNull } from 'util';

function newColumn(title, dataIndex, render = undefined) {
  return { title, dataIndex, render, key: dataIndex }
}

const defaultGoBack = {
  router: '/SnackOrderManager/AddSnackOrder',
  title: '去添加零食订单',
}

function removeEmptyArrayEle(arr){    
  for(let i = 0; i < arr.length; i++) {
   if(arr[i] === "") {
      arr.splice(i,1);
      i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                       // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
    }
   }
   return arr;
};

function getCount(arr) {
  const obj = {};
  let k; 
  for (let i = 0, len = arr.length; i < len; i++) {
    k = arr[i][0];
    if (obj[k]) {
      obj[k] +=parseInt(arr[i][1], 10);
    } else {
      obj[k] = 1;
    }
  }
  return obj;
}

@connect(({ snackorder, loading }) => ({
    snackorder, // 这里要改
  isSaving: loading.effects['snackorder/fetchSnacksOrderList'],// 这里要改
  loadingPieChart: loading.effects['snackorder/fetchSnacksOrderList'],
  loading: loading.models.snackorder,
}))
@Form.create()
class SnackOrderList extends Component{
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

 

  onDeleteOrder(it) {
    if (!it) return;
    this.clearError();
   
    const { dispatch } = this.props;
    dispatch({
      type: 'snackorder/fetchSnacksOrderDelete',// 
      payload: { uuid: it.uuid },
    });
    this.query();
  }


  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  handleSearch = e => {
     e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.query({ dormitory: fieldsValue.dormitory })
      this.setState({
        formValues: { ...fieldsValue }
      });
     
    })
  }

  onQueryChartData = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.warn(fieldsValue.dormitory)
      if (fieldsValue.dormitory === undefined) {
        this.query();
      }
     
      this.setState({
        formValues: { ...fieldsValue },
        dormitory: fieldsValue.dormitory,
      });
      dispatch({
        type: 'snackorder/fetchSnacksOrderBydormitory',
        payload: {...fieldsValue },
      })
    })
  }

  requery = () => {
    this.query();
  }

  resetSeatch() {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    })
  }

  

  query( params = {}) {
    console.warn('param', params)
    this.clearError();
    const { dispatch } = this.props;
    if (params.hasOwnProperty('number') === false) {
      params.number = 10;
    }
    if (params.hasOwnProperty('page') === false) {
      params.page = 1;
    }
    dispatch({
      type: 'snackorder/fetchSnacksOrderList',
      payload: { ...params }
    });
  }

  clearError() { this.setState({ error: '' }); }

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
    const {loading ,snackorder, isSaving, form } = this.props;
    const { error, dormitory, pagination } = this.state;
    // const { showSnacksOrderList, QuerySnacksOrderData } = snackorder;
    const showSnacksOrderList = Array.isArray(snackorder.showSnacksOrderList) > 0 ? snackorder.showSnacksOrderList : [];
    const querySnacksOrderData = snackorder.QuerySnacksOrderData;
    let count = _.get(showSnacksOrderList[0], 'count');
    if(count === 0) {
      count = showSnacksOrderList.length
    }
    console.warn('QuerySnacksOrderData111111', showSnacksOrderList)
    pagination.total = count;

    const getSancks = [];
    let  bigSancksFamily = [];
    let SancksStr = '';
    showSnacksOrderList.map(it => {
      getSancks.push(_.pick(it, 'goodsname'));
    });
    
    const tableColumns = getQrcodeColumns(
      { snackorder },
      {
        onDeleteOrder: this.onDeleteOrder.bind(this),
      }
    );

    getSancks.map((it)=> {
      SancksStr += it.goodsname + "+";
    });

    bigSancksFamily = SancksStr.split('+');
    const empty = removeEmptyArrayEle(bigSancksFamily);
    // console.warn('empty',empty)
    const sum = [];
    empty.map(it => {
      sum.push(it.split('x'));
    });
    const pieChartData = getCount(sum);
    // const pieChartData = empty.reduce((allNames, name) => {
    //   if (name in allNames) {
    //      allNames[name]++;
    //   } else {
    //     allNames[name] = 1;
    //   }
    //   return allNames;
    // }, {});

   

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
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          操作提示
        </Button>
        <Drawer
          title="温馨提示"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <p><big>一、宿舍统计：</big></p>
          <p>1.先在搜索输入框输入需要统计的宿舍号。</p>
          <p>2.然后点击宿舍统计即可，展示的饼图即是该宿舍的零食消费情况。</p>
          <p>3.展示的信息分别表示：零食名称、消费数量、以及该品种零食占该宿舍的整体百分比。</p>
          <p>4.统计缺陷：目前只能统计每个宿舍累积订单的零食种类消费情况，例如：起初的放置盒子的零食、第一次补货、第二次补货等累积订单的零食消费情况，不能统计零食盒子每次单元的零食消费情况。除非补货完成后，把之前订单记录删除，但不建议这样做，不利于订单的统计。</p>
        </Drawer>
      </div>
    );

    const sumbmitText = (
      <Col md={16} sm={24} style={{ marginTop: 43}}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 20}}>查询</Button>
        <Button onClick={e =>{ e.preventDefault(); this.resetSeatch();}}>重置</Button>
        <Button style={{ marginLeft: 10 }} onClick={this.requery}>刷新</Button>&nbsp;&nbsp;&nbsp;
        <PiaChartModal onQueryChartData={this.onQueryChartData} dormitory={dormitory} pieChartData={pieChartData} showSnacksOrderList={querySnacksOrderData} />

      </Col>
    );

    const renderOrderFilter = (
      <Form onSubmit={this.handleSearch} layout="horizontal" style={{ marginBottom: 30}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="宿舍筛选">
              {form.getFieldDecorator('dormitory', {
                rules: [
                   { required: true , message: '宿舍关键字不为空' },
                ]
              })(<Input placeholder="宿舍号关键字" />)}
            </Form.Item>
          </Col>
          {sumbmitText}
        </Row>
      </Form>
    );

    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent="">
        <Card bordered={false} title={<span><Icon type="unordered-list" />已完成零食订单列表</span>} error={error} extra={extra}>
          {renderOrderFilter}
          <Table
            loading={loading}
            columns={tableColumns}
            rowKey={record => record.uuid}
            dataSource={showSnacksOrderList}
            pagination={pagination}
            onChange={this.handleTableChange}
            size="middle"
            expandedRowRender={record => <div><p>订单编号：{record.uuid}</p><br /><p>微信openid：{record.openid ? record.openid: <span>无</span> }</p></div>}
            components={this.components}
            scroll={{ x: 1100 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default SnackOrderList;



