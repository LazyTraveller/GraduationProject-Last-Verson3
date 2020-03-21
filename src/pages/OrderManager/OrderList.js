import React ,{ PureComponent,Fragment} from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Table, Card ,Input, Row, Col, Button,Badge,message} from 'antd';
import getOrderColumns from './OrderTable';
import { easyRouteTo } from '../../utils/easyDispatch';

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

@connect(({ order, loading }) => ({
    order,
    loading: loading.models.order,
}))
@Form.create()
class OrderList extends PureComponent {
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

    onDeleteOrder(orderList) {
      if (!orderList) return;
      this.clearError();
      // console.warn('page uuid',orderList.uuid);
      const { dispatch } = this.props;
      dispatch({
        type: 'order/fetchDeleteOeder',
        payload: {uuid: orderList.uuid },
      });
      this.query();
    }

   
    clearError() { this.setState({ error: '' }); }

    query() {
      this.clearError();
      const { dispatch } = this.props;
        dispatch({
            type: 'order/fetchOederList',
        });
    }
    
   

    onMarkOrder(uuid) {
      const { dispatch } = this.props;
      // console.warn('page uuid',uuid)
      dispatch({
        type: 'order/fetchonMarkOrder',
        payload: { uuid }
      });
      this.query();
    }

    handleSearch =e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
       form.validateFields((err, fieldsValue) => {
         if (err) return;
         this.setState({
           formValues: { ...fieldsValue },
         });
         dispatch({
           type: 'order/fetchqueryByNameOrPhone',
           payload: {...fieldsValue },
         })
       });
    }

    onEditSubmit(values) {
      const { dispatch } = this.props;
      this.clearError();
      const sendEditValues = Object.assign({},values);
      sendEditValues.take_time = values.take_time.format('YYYY-MM-DD HH:mm');
      sendEditValues.send_time = values.send_time.format('YYYY-MM-DD HH:mm');
      // console.warn('AAAAAAAAAAAAAAAAAAAAAAAA',sendEditValues);
      dispatch({
        type: 'order/fetchOrderEdit',
        payload: sendEditValues,
      });
      message.success('修改成功');
      this.query();
    }

    handleFormReset = () => {
      const { form, dispatch } = this.props;
      form.resetFields();
      this.setState({
        formValues: {}
      });
    }

    // 
    onEditOrder(uuid) {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/fetchOrderbyUUID',
        payload: uuid
      })

    }

   

    render() {
        const { order,loading, form}= this.props;
        const { error } = this.state;
        const orderList = Array.isArray(order.orderList) > 0 ? order.orderList : [];
      
        const tableColumns = getOrderColumns(
            { order },
            {
              //onEditOrder: it => easyRouteTo(this, `/order/basic-list/${it.uuid}`),
              onDeleteOrder: this.onDeleteOrder.bind(this),
              onMarkOrder: this.onMarkOrder.bind(this),
              onEditOrder: this.onEditOrder.bind(this),
              onEditSubmit: this.onEditSubmit.bind(this),
              clearError: this.clearError.bind(this),


            });

        const submitText = (
          <Col md={6} sm={8}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
        );
         
        const renderOrderFilter = (
          <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: 30}}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <Form.Item label="名字筛选">
                  {form.getFieldDecorator('username', {
                  rules: [
                    {
                     // required: false,
                      message: '请输入要查询的客户名字！',
                    }
                  ]
                  
               })(<Input placeholder="客户名字关键字" />)} 
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label="电话筛选">
                  {form.getFieldDecorator('phone', {
                    rules: [
                    {
                     // required: false,
                      message: '请输入查询的电话号码!',
                    }
                  ]
            })(<Input placeholder="客户电话关键字" />)}
                </Form.Item>
              </Col>
              {submitText}
              <Col md={4} sm={24}>
                <span style={{ color: '#e60000'}}>未处理订单总数： <Badge count={orderList.length} /> &nbsp;请及时处理</span>
               
              </Col>
            </Row>
          </Form>
        );
        return(
            <Card bordered={false}>
              {renderOrderFilter}
              <Table
                loading={loading}
                columns={tableColumns}
                rowKey={record => record.uuid}
                dataSource={orderList}
                pagination={{"defaultPageSize":10, showQuickJumper: true }}
                size="middle"
               // bordered
                expandedRowRender={record => <div><p style={{ margin: 0 }}>留言备注：{record.textarea}</p><br /><p>寄存点：{record.address}</p></div>}
                components={this.components}
              />
            </Card>
        )
    }
}

export default OrderList;
