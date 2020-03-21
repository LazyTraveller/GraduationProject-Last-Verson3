import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Modal, Button, Select, message,Radio ,Checkbox, Divider} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';

function showImage(url) {
  Modal.info({
    title: "零食详图",
    content: <img src={url} alt={url} style={{ width: "80%" }} />,
    width: window.innerWidth * 0.4,
  });
}

const RadioGroup = Radio.Group;
const { Option } = Select;

const defaultGoBack = {
  router: '/SnackOrderManager/SnackOrderList',
  title: '零食订单列表',
}

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

function newMaxLenRule(len, name) {
  return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
}

@connect(({ snackorder, loading }) => ({
    snackorder, // 这里要改
  isSaving: loading.effects['snackorder/fetchApplyList'],// 这里要改
  loading: loading.models.snackorder,
}))
@Form.create()
class AddSnackOrder extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      selectvalue: undefined,
      valueCheckbox: [],
      Checkboxmoney: 0,
    }
  }

  componentDidMount() {
    this.query();
  }

  onChangeCheckbox = (checkedValues)=> {
    let checkboxmoney = 0;
    
    checkedValues.map(it => {
      checkboxmoney += parseInt(it,10);
    })
   

    this.setState({
     valueCheckbox: checkedValues,
     Checkboxmoney: checkboxmoney,
    })
  }

  onSubmit() {
    const { dispatch, form, snackorder } = this.props;
    const {selectvalue, valueCheckbox, Checkboxmoney} = this.state;
    const showIssue = Array.isArray(snackorder.showIssue) > 0 ? snackorder.showIssue : [];
    let C = 0;
    showIssue.map(it => {
      C = _.get(it, 'discount');
    });

    let sendCheckbox = '';
    valueCheckbox.map(it => {
      const A = it.split("+");
      sendCheckbox += A[1]+"+";

    });
   
     const A = sendCheckbox.substring(0, sendCheckbox.lastIndexOf('+'));
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({ error: '' });
      const sendValues = Object.assign({ }, values);
      sendValues.Qrcode_id = selectvalue;
      sendValues.goodsname = A;
      sendValues.money = (Checkboxmoney * C).toFixed(1);
     
      dispatch({
        type: 'snackorder/fetchSnacksOrderAdd',
        payload: sendValues,
      });
    });
    easyRouteTo(this, defaultGoBack.router);
  }


  SelectChange = (value) => {
   
    this.setState({
      selectvalue: value
    })
  }

  query() {
    const { dispatch } = this.props;
    dispatch({
      type: 'snackorder/fetchQrcodeList',
    });
    dispatch({
      type: 'snackorder/fetchSnackList',
    });
    dispatch({
      type: 'snackorder/fetchIssueList',
    })
  }

  resetvalueCheckbox() {
    this.setState({
      valueCheckbox:[],
      Checkboxmoney: 0,
    })
  }

  render() {
    const { isSaving , snackorder} = this.props;
    const { valueCheckbox, Checkboxmoney } = this.state;
    const Qrcodelist = Array.isArray(snackorder.Qrcodelist) > 0 ? snackorder.Qrcodelist : [];
    const snackList = Array.isArray(snackorder.snackList) > 0 ? snackorder.snackList : [];
    const showIssue = Array.isArray(snackorder.showIssue) > 0 ? snackorder.showIssue : [];

    let C = 0;
    showIssue.map(it => {
      C = _.get(it, 'discount');
    });

   
    const Qrcodebinded = [];
    Qrcodelist.map(it => {
      if ( _.get(it, 'status') === true) Qrcodebinded.push(it);
    });
  
    const { error } = this.state;

    const content = (
      <div>
        <Button 
          icon="left"
          type="primary"
          onClick={ev => {ev.preventDefault(); easyRouteTo(this,defaultGoBack.router); }}
        >
          {defaultGoBack.title}
        </Button>
      </div>
    );
    const extracontent = (
      <div>
        <Button
          icon="check"
          type="primary"
          disabled={!!isSaving || !!error}
          onClick={ev => { ev.preventDefault(); this.onSubmit(); }}
        >
          确认添加
        </Button>
      </div>
    );

       /** @type {AntdForm} */
       const antdForm = this.props.form;
       const { getFieldDecorator } = antdForm;
   
       const form = createFormItems(antdForm);

    return (
      <PageHeaderWrapper title="" content={content} extraContent={extracontent}>
        <Card title={<span><Icon type="medicine-box" />&nbsp;模拟小程序下单</span>} style={{ marginBottom: 10 }}>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="已与宿舍绑定的二维码ID">
                {getFieldDecorator('Qrcode_id', {
                  rules: [
                    // { required: true, message: '请选择提醒类型' }
                  ]
                })(
                  <div>
                    <Select placeholder="请选择已绑定的二维码id" style={{ width: 500,marginRight: 50 }} onChange={this.SelectChange}>
                      {Qrcodebinded.map( it => <Option value={it.qrcode_id} key={it.uuid+it.time}>{it.qrcode_id}--({it.dormitory})</Option>)}
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 30 }}>
            <Col lg={6} md={12} sm={24}>
              <Button onClick={ev=> { ev.preventDefault(); this.resetvalueCheckbox()}} size="large">重选</Button>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <div>合计费用： {(Checkboxmoney * C).toFixed(1)}&nbsp;&nbsp;&nbsp;<span style={{ color: "#ea521a" }}>{C < 1 ? <span>(活动促销打{C}折)</span> : null}</span></div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={24} md={24}>
              
              <Form.Item label="请选择零食商品">
                {getFieldDecorator('goodsname', {

                })(
                  <div>
                    <Checkbox.Group onChange={this.onChangeCheckbox} value={valueCheckbox}>
                    <Row>
                      {
                        snackList.map(item => (
                          <Col span={5} style={{ marginBottom: 50, marginRight: 50 }}>
                            <img src={item.images} alt={item.images} style={{ width: 100, height: 100 ,marginRight: 50}} onClick={showImage.bind(this, item.images)} />
                            <Checkbox value={item.money+"+"+item.name} key={item.uuid+item.time}>{item.name}&nbsp;&nbsp;&nbsp;{item.money}￥</Checkbox>
                            <Divider />
                          </Col>
                        ))
                        }
                    </Row>
                    </Checkbox.Group>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
         
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default AddSnackOrder;




