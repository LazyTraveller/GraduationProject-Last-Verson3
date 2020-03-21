import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';


const defaultGoBack = {
  router: '/QrcodeManager/QrcodeList',
  title: '宿舍二维码绑定列表',
}

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

function newMaxLenRule(len, name) {
  return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
}

@connect(({ qrcode, loading }) => ({
    qrcode, // 这里要改
  isSaving: loading.effects['qrcode/fetchQrcodeList'],// 这里要改
  loading: loading.models.qrcode,
}))
@Form.create()
class AddQrcode extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      // sex: '男'
    }
  }

  onSubmit() {
    // const { sex } = this.state;
    const { dispatch, form } = this.props;
    
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({ error: '' });
      const sendValues = Object.assign({ }, values);
      
      dispatch({
        type: 'qrcode/fetchQrcodeAdd',
        payload: sendValues,
      });
    });
    easyRouteTo(this, defaultGoBack.router);
  }

   handleChange = (value) => {
  
    this.setState({
      sex: value,
    })
  }


  render() {
    const { isSaving } = this.props;
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
        <Card title={<span><Icon type="file" />&nbsp;填写宿舍二维码绑定信息</span>} style={{ marginBottom: 10 }}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="二维码ID(测试用)">
                {form.input({
                  name: 'Qrcode_id', rules: [
                    newRequiredRule(`二维码ID不允许为空`),
                    newMaxLenRule(255, `二维码ID`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="宿舍号">
                {form.input({
                  name: 'dormitory', rules: [
                    newRequiredRule(`宿舍号不允许为空`),
                    newMaxLenRule(255, `宿舍号`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食总额">
                {form.input({
                  name: 'summoney', rules: [
                    newRequiredRule(`零食总额不允许为空`),
                    newMaxLenRule(255, `零食总额`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食余额">
                {form.input({
                  name: 'leftmoney', rules: [
                    newRequiredRule(`零食余额不允许为空`),
                    newMaxLenRule(255, `零食余额`),
                  ]
                })}
              </Form.Item>
            </Col>
           
          </Row>
          {/* <Row gutter={16}>
           
          </Row> */}
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default AddQrcode;




