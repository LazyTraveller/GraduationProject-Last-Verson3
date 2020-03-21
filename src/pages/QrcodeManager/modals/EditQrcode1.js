import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  InputNumber,
} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

function newRequiredRule(msg) {
  return { required: true, message: msg };
}

@connect(({ qrcode }) => ({
  qrcode,
}))
@Form.create()
class EditQrcode1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      loading: false,
      inputNumber: 1,
      valueCheckbox: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/fetchSnackList',
    });
  }

  onChangeCheckbox = (checkedValues)=> {
    const { inputNumber } = this.state;
    console.warn("checkedValues",checkedValues)
    const check = {};

    // checkedValues.map(it => {
    //   // check[it] = inputNumber;
    // });
    // console.warn("checkcheckcheckcheckcheck",check)
    this.setState({
      valueCheckbox: checkedValues,
     })
  };

  onEditSubmit(values, callback) {
    const { onOk } = this.props;
    onOk(Object.assign({}, values), callback(true));
  }

  onChange = value => {
    this.setState({
      inputNumber: value,
    });
    // return value;
    console.warn('changed', value);
  };

  render() {
    const { qrcode, onShowAsync } = this.props;
    const { valueCheckbox, inputNumber } = this.state;
    const gotEditQrcode = Object.assign({}, qrcode.gotEditQrcode);
    const snackList = Array.isArray(qrcode.snackList) > 0 ? qrcode.snackList : [];
    const statusMapper = {
      true: '已绑定',
      false: '未绑定',
    };
    return (
      <FormSubmitModal
        title="选择补货商品"
        onOk={this.onEditSubmit.bind(this)}
        onShowAsync={onShowAsync}
        width={550}
        formProvider={form => (
          <Fragment>
            <Row gutter={10}>
              <Col md={8}>
                <Form.Item label="分类UUID">
                  {form.getFieldDecorator('uuid', {
                    initialValue: gotEditQrcode.uuid,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="二维码ID">
                  {form.getFieldDecorator('qrcode_id', {
                    initialValue: gotEditQrcode.qrcode_id,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="绑定状态">
                  {form.getFieldDecorator('status', {
                    initialValue: statusMapper[gotEditQrcode.status],
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col md={8}>
                <Form.Item label="宿舍号">
                  {form.getFieldDecorator('dormitory', {
                    initialValue: gotEditQrcode.dormitory,
                    rules: [{ required: true, message: '宿舍号不为空' }],
                  })(<Input placeholder="请编辑绑定的宿舍" />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="总共零食金额">
                  {form.getFieldDecorator('summoney', {
                    initialValue: gotEditQrcode.summoney,
                    rules: [{ required: true, message: '金额不为空' }],
                  })(<Input placeholder="请编辑总金额" />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="剩余零食金额">
                  {form.getFieldDecorator('leftmoney', {
                    initialValue: gotEditQrcode.leftmoney,
                    rules: [{ required: true, message: '金额不为空' }],
                  })(<Input placeholder="请编辑剩余金额" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              {/* <Form.Item>
                {form.getFieldDecorator('sum', {})( */}
              <Checkbox.Group onChange={this.onChangeCheckbox} value={valueCheckbox}>
                {snackList.map(it => (
                  <Col md={24}>
                    <Checkbox
                      value={it.money + '+' + it.name + '+' + inputNumber}
                      key={it.money + it.time + it.uuid}
                      style={{ marginBottom: 5 }}
                    >
                      {it.name}&nbsp;&nbsp;&nbsp;x<span style={{ color: 'red' }}>{it.money}</span>
                    </Checkbox>
                    <InputNumber
                      style={{ display: 'absolute', marginRight: 50 }}
                      size="small"
                      min={1}
                      max={100}
                      defaultValue={1}
                      onChange={this.onChange}
                    />
                  </Col>
                ))}
              </Checkbox.Group>
              {/* )}
              </Form.Item> */}
            </Row>
            <span>合计：111</span>
          </Fragment>
        )}
      >
        {this.props.children}
      </FormSubmitModal>
    );
  }
}

export default EditQrcode1;
