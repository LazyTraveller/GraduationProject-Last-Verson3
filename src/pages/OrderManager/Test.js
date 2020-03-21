import React ,{ PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Table, Card ,Input, Row, Col, Button,} from 'antd';
import getOrderColumns from './OrderTable';
import { easyRouteTo } from '../../utils/easyDispatch';

@connect(({ order, loading }) => ({
    order,
    loading: loading.models.order,
}))
@Form.create()
class PendingList extends PureComponent {
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

      onDeleteOrder(pendList) {
        if (!pendList) return;
        this.clearError();
        // console.warn('page uuid',pendList.uuid);
        const { dispatch } = this.props;
        dispatch({
          type: 'order/fetchDeleteOeder',
          payload: {uuid: pendList.uuid },
        }).then((response) => {
          if (response === "删除成功"){
               this.query();
          }
        });
      }
  
      clearError() { this.setState({ error: '' }); }
  
      query() {
        this.clearError();
        const { dispatch } = this.props;
          dispatch({
              type: 'order/fetchPengingList',
          });
      }
  
      onSubmit() {
        this.props.form.validateFields((error, values) => {
          if (error) return;
          this.setState({ error: ''});
          const queryValues = Object.assign({}, values);
          // console.warn("query got the data", queryValues);
          this.props.dispatch({
            type: 'order/fetchqueryByNameOrPhone',
            payload: { ...values },
            
          })
        })
  
      }

      handleSearch =e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
         form.validateFields((err, fieldsValue) => {
           if (err) return;
           this.setState({
             formValues: { ...fieldsValue },
           });
          //  console.warn('1111111111111111',fieldsValue);
          // if (fieldsValue === '') {
          //   message.error()
          // }
  
           dispatch({
             type: 'order/fetchqueryByNameOrPhone',
             payload: {...fieldsValue },
           })
         })
  
  
      }
  
      handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {}
        });
      }



    render() {
        const { order,loading,form}= this.props;
        const { error } = this.state;
        const pendList = Array.isArray(order.pendList) > 0 ? order.pendList : [];
        // console.warn('pendList',pendList);

        const tableColumns = getOrderColumns(
            { order },
            {
              onEditOrder: it => easyRouteTo(this, `/order/basic-list/${it.uuid}`),
              onDeleteOrder: this.onDeleteOrder.bind(this),
            });

        const submitText = (
          <Col md={4} sm={8}>
            <Button icon="check" type="primary" htmlType="submit" onClick={ev => { ev.preventDefault(); this.onSubmit();}}>查询</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
          );
             
          const renderOrderFilter = (
            <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: 30}}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <Form.Item label="名字筛选">
                    {form.getFieldDecorator('username', {
                    rules: [
                      {
                        required: false,
                        message: '请输入要查询的客户名字！',
                      }
                    ]
                    
                 })(<Input placeholder="客户名字关键字" />)} 
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label="电话筛选">
                    {form.getFieldDecorator('phone', {
                      rules: [
                      {
                        required: false,
                        message: '请输入查询的电话号码!',
                      }
                    ]
              })(<Input placeholder="客户电话关键字" />)}
                  </Form.Item>
                </Col>
                {submitText}
                <Col md={4} sm={24}>
                  <span style={{ color: '#e60000'}}>已处理订单总数：{pendList.length}</span>
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
              dataSource={pendList}
              pagination={{"defaultPageSize":10, showQuickJumper: true }}
              size="middle"
               // bordered
              expandedRowRender={record => <div><p style={{ margin: 0 }}>备注：{record.textarea}</p><br /><p>地址：{record.address}</p></div>}

            />
          </Card>
        );
    }
}
export default PendingList;
