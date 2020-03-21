import React, { Component} from 'react';
import { connect } from 'dva';
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,

} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import axios from 'axios';


const URL = 'https://www.eyuwu.cn/zhuhaiweb';
const defaultGoBack = {
  router: '/fund/WithdrawList',
  title: '提现申请记录',
};

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

function newMaxLenRule(len, name) {
  return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
}

@connect(({ fund, loading }) => ({
    fund, 
  isSaving: loading.effects['fund/fetchAddfund'], 
  loading: loading.models.fund,
}))
@Form.create()
class Addfund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formValues: {},
    };
  }

  onSubmit() {
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (error) return;
      this.setState({
          error: '',
          formValues: { ...values }
        });
      const sendValues = Object.assign({}, values);
      console.warn('sendValues', sendValues);
      // dispatch({
      //   type: 'fund/fetchAddfund',
      //   payload: sendValues,
      // });
      axios.post(`${URL}/Fund/SelectAllFund`, {
        money: sendValues
      }).then(function(response) {
        console.warn(response);
      }).catch(function(error) {
        console.warn(error);
      })
    });
    easyRouteTo(this, defaultGoBack.router);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
  }

  render() {
    const { isSaving, form } = this.props;
    const { error } = this.state;

    const content = (
      <div>
        <Button
          icon="left"
          type="primary"
          onClick={ev => {
            ev.preventDefault();
            easyRouteTo(this, defaultGoBack.router);
          }}
        >
          {defaultGoBack.title}
        </Button>
      </div>
    );

    const submitText = (
      <div style={{ marginTop: 43 }}>
        <Col md={8} sm={24}>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            提交
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>
            重置
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this.requery}>
            刷新
          </Button>
        </Col>
      </div>
    );

    return (
      <PageHeaderWrapper title="" content={content}>
        <Card title="申请提现" style={{ marginTop: 32 }}>
          <Form onSubmit={ev => { ev.preventDefault(); this.onSubmit(); }} layout="horizontal" style={{ marginBottom: 30 }}>
            <Row gutter={16}>
              <Col md={6} sm={24}>
                <Form.Item label="提现金额">
                  {form.getFieldDecorator('money', {
                   rules: [
                    { required: true , message: '提现金额不为空' },
                 ]
                  })(<Input placeholder="请输入提现金额" />)}
                </Form.Item>
              </Col>
              {submitText}
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Addfund;
