import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input,Select, Upload,message, Icon,DatePicker,Badge,Button,Radio} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

function newRequiredRule(msg) {
    return { required: true, message: msg };
}

@connect(({ qrcode }) => ({
  qrcode,
}))
@Form.create()
class EditQrcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading: false
        }
    }

    onEditSubmit(values, callback) {
        const { onOk } = this.props;
        onOk(Object.assign({}, values), callback(true));
   }

    render() {
      
      const { qrcode , onShowAsync } = this.props;
      const gotEditQrcode = Object.assign({}, qrcode.gotEditQrcode);
      const statusMapper = {
        true: '已绑定',
        false: '未绑定',
      }
      return(
        <FormSubmitModal
          title="编辑宿舍绑定"
          onOk={this.onEditSubmit.bind(this)}
          onShowAsync={onShowAsync}
          formProvider={form => (
            <Fragment>
              <Row gutter={8}>
                <Col md={12}>
                  <Form.Item label="分类UUID">
                    {form.getFieldDecorator('uuid', {
                        initialValue:  gotEditQrcode.uuid,
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item label="二维码ID">
                    {form.getFieldDecorator('qrcode_id', {
                        initialValue:  gotEditQrcode.qrcode_id,
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col md={12}>
                  <Form.Item label="宿舍号">
                    {form.getFieldDecorator('dormitory', {
                        initialValue:  gotEditQrcode.dormitory,
                        rules: [
                          { required: true, message: '宿舍号不为空'}
                        ]
                    })(
                      <Input placeholder="请编辑绑定的宿舍" />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item label="绑定状态">
                    {form.getFieldDecorator('status', {
                        initialValue:  statusMapper[gotEditQrcode.status],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col md={12}>
                  <Form.Item label="总共零食金额">
                    {form.getFieldDecorator('summoney', {
                        initialValue:  gotEditQrcode.summoney,
                        rules: [
                          { required: true, message: '金额不为空'}
                        ]
                    })(
                      <Input placeholder="请编辑总金额" />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item label="剩余零食金额">
                    {form.getFieldDecorator('leftmoney', {
                        initialValue:  gotEditQrcode.leftmoney,
                        rules: [
                          { required: true, message: '金额不为空'}
                        ]
                    })(
                      <Input placeholder="请编辑剩余金额" />
                    )}
                  </Form.Item>
                </Col>
              </Row>

            </Fragment>
          )}
        >
          {this.props.children}
        </FormSubmitModal>

    );
    }
}

export default EditQrcode;