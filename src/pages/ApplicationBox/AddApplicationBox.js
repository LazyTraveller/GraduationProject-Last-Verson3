import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';

const { Option } = Select;

const defaultGoBack = {
  router: '/ApplicationBox/ApplicationBoxList',
  title: '申请盒子列表',
}

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

function newMaxLenRule(len, name) {
  return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
}

@connect(({ ApplicationBox, loading }) => ({
    ApplicationBox, // 这里要改
  isSaving: loading.effects['ApplicationBox/fetchApplyList'],// 这里要改
  loading: loading.models.ApplicationBox,
}))
@Form.create()
class AddApplicationBox extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      sex: '男'
    }
  }

  onSubmit() {
    const { sex } = this.state;
    const { dispatch, form } = this.props;
    
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({ error: '' });
      const sendValues = Object.assign({ }, values);
      sendValues.sex = sex;
      
      dispatch({
        type: 'ApplicationBox/fetchApplyAdd',
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
        <Card title={<span><Icon type="file" />&nbsp;填写申请盒子信息</span>} style={{ marginBottom: 10 }}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="姓名">
                {form.input({
                  name: 'name', rules: [
                    newRequiredRule(`姓名不允许为空`),
                    newMaxLenRule(255, `姓名`),
                  ]
                })}
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
              <Form.Item label="性别" style={{  marginRight: 50 }}>
                {getFieldDecorator('sex', {
                  rules: [
                    { required: false, message: "请选择性别" }
                  ]
                })(
                  <div>
                    <Select defaultValue="男" style={{ width: 200, marginRight: 50 }} onChange={this.handleChange}>
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
           
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="学号">
                {form.input({
                  name: 'sno', rules: [
                    newRequiredRule(`学号不允许为空`),
                    newMaxLenRule(255, `学号`),
                  ]
                })}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="电话">
                {form.input({
                  name: 'phone', rules: [
                    newRequiredRule(`电话不允许为空`),
                    newMaxLenRule(255, `电话`),
                    { pattern: /^1[34578]\d{9}$/, message: '请输入有效手机号码'}
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
export default AddApplicationBox;




