import React , { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Row ,Col, Form, Input,Select, Upload,message, Icon,DatePicker,Badge,Button,Radio} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

@connect(({ snacks }) => ({
    snacks,
}))
@Form.create()
class EditSnacks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading: false,
        }
    }

    onEditSubmit(values, callback) {
        const { onOk } = this.props;
        onOk(Object.assign({}, values ), callback(true));
    }

    render () {
        const { snacks, onShowAsync } = this.props;
        const gotEditSnacks = Object.assign({}, snacks.gotEditSnacks);
       
        return (
          <FormSubmitModal
            title="编辑零食信息"
            onOk={this.onEditSubmit.bind(this)}
            onShowAsync={onShowAsync}
            formProvider={form => (
              <Fragment>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="零食UUID">
                      {form.getFieldDecorator('uuid', {
                        initialValue: gotEditSnacks.uuid,

                      })(
                        <Input disabled />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="零食名称">
                      {form.getFieldDecorator('name', {
                        initialValue: gotEditSnacks.name,
                        rules: [
                          { required: true, message: '零食名称不为空'}
                        ]
                      })(
                        <Input placeholder="请编辑零食名称" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="零食照片">
                      {form.getFieldDecorator('images', {
                        initialValue: gotEditSnacks.images,
                      })(
                        <img src={gotEditSnacks.images} alt={gotEditSnacks.images} style={{ width: 100, height: 100}} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="零食分类(不可修改)">
                      {form.getFieldDecorator('classify_uuid', {
                        initialValue: gotEditSnacks.classify_uuid,
                      })(
                        <Input disabled />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={24}>
                    <Form.Item label="零食单价">
                      {form.getFieldDecorator('money', {
                        initialValue: gotEditSnacks.money,
                        rules: [
                          { required: true, message: '零食单价不为空'}
                        ]
                      })(
                        <Input placeholder="请编辑金额" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            )}

          >
              {this.props.children}
          </FormSubmitModal>
        )
    }
}
export default EditSnacks;