import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';

const { Option } = Select;

const defaultGoBack = {
  router: '/ShortageRemind/ShortageRemindList',
  title: '缺货提醒列表',
}

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

function newMaxLenRule(len, name) {
  return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
}


@connect(({ ShortageRemind, loading }) => ({
    ShortageRemind, // 这里要改
    isSaving: loading.effects['ShortageRemind/fetchRemindList'],
    loading: loading.models.ShortageRemind,
}))
@Form.create()
class AddShortageRemind extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      remind: '缺货提醒',
    }
  }


  onSubmit() {
    const { remind } = this.state;
    const { dispatch, form } = this.props;
    
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({ error: '' });
      const sendValues = Object.assign({ }, values);
      sendValues.remind = remind;
     
      dispatch({
        type: 'ShortageRemind/fetchRemindAdd',
        payload: sendValues,
      });
    });
    easyRouteTo(this, defaultGoBack.router);
  }

   handleChange = (value) => {
   
    this.setState({
      remind: value,
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
        <Card title={<span><Icon type="file" />&nbsp;填写缺货提醒信息</span>} style={{ marginBottom: 10 }}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="选择提醒类型" style={{  marginRight: 50 }}>
                {getFieldDecorator('remind', {
                  rules: [
                    { required: false, message: "请选择提醒类型" }
                  ]
                })(
                  <div>
                    <Select defaultValue="缺货提醒" style={{ width: 200 ,marginRight: 50 }} onChange={this.handleChange}>
                      <Option value="缺货提醒">缺货提醒</Option>
                      <Option value="零食推荐">零食推荐</Option>
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="宿舍号">
                {form.input({
                  name: 'address', rules: [
                    newRequiredRule(`宿舍号不允许为空`),
                    newMaxLenRule(255, `宿舍号`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食推荐">
                {form.input({
                  name: 'textarea', rules: [
                    // newRequiredRule(`零食推荐不允许为空`),
                    newMaxLenRule(255, `零食推荐`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="缺货零食">
                {form.input({
                  name: 'sex', rules: [
                    // newRequiredRule(`缺货零食不允许为空`),
                    newMaxLenRule(255, `缺货零食`),
                  ]
                })}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default AddShortageRemind;



