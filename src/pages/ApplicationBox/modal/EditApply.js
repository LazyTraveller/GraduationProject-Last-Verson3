import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input,Select, Upload,message, Icon,DatePicker,Badge,Button,Radio} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

@connect(({ ApplicationBox }) => ({
    ApplicationBox,
  }))
  @Form.create()
class EditApplyModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading: false,
        }
    }

    onEditSubmit(values, callback) {
        const { onOK } = this.props;
        onOK(Object.assign({}, values), callback);
    }

    render() {
        const { onShowAsync, ApplicationBox } = this.props;
        const gotEditApply = Object.assign({}, ApplicationBox.gotEditApply);
        const statusMapper = {
          true: '已处理',
          false: '未处理',
    }
        return (
          <FormSubmitModal
            title='编辑盒子申请信息'
            onOk={this.onEditSubmit.bind(this)}
            onShowAsync={onShowAsync}
            formProvider={form =>(
              <Fragment>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="申请UUID">
                      {form.getFieldDecorator('uuid', {
                          initialValue: gotEditApply.uuid,
                         
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="openid">
                      {form.getFieldDecorator('openid', {
                          initialValue: gotEditApply.openid,
                         
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="申请人">
                      {form.getFieldDecorator('name', {
                          initialValue: gotEditApply.name,
                          rules: [
                            { required: true, message: '申请人名字不为空'}
                          ]
                      })(<Input placeholder="请编辑姓名" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={12}>
                    <Form.Item label="宿舍号">
                      {form.getFieldDecorator('address', {
                          initialValue: gotEditApply.address,
                          rules: [
                            { required: true, message: '宿舍号不为空'}
                          ]
                      })(<Input placeholder="请编辑宿舍号" />)}
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item label="性别">
                      {form.getFieldDecorator('sex', {
                          initialValue: gotEditApply.sex,
                          rules: [
                            { required: true, message: '性别不为空'}
                          ]
                      })(<Input placeholder="请编辑性别" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="学号">
                      {form.getFieldDecorator('sno', {
                          initialValue: gotEditApply.sno,
                          rules: [
                            { required: true, message: '学号不为空'}
                          ]
                      })(<Input placeholder="请编辑学号" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={12}>
                    <Form.Item label="电话">
                      {form.getFieldDecorator('phone', {
                          initialValue: gotEditApply.phone,
                          rules: [
                            { required: true, message: '电话不为空'}
                          ]
                      })(<Input placeholder="请编辑电话" />)}
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item label="状态">
                      {form.getFieldDecorator('status', {
                          initialValue: statusMapper[gotEditApply.status],
                      })(<Input disabled />)}
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

export default EditApplyModal;