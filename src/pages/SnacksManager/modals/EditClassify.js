import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input,Select, Upload,message, Icon,DatePicker,Badge,Button,Radio} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

function newRequiredRule(msg) {
    return { required: true, message: msg };
}

@connect(({ snacks }) => ({
    snacks,
}))
@Form.create()
class EditClassify extends React.Component {

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
      
      const { snacks , onShowAsync } = this.props;
      const editingClassify = Object.assign({}, snacks.editingClassify);
      return(
        <FormSubmitModal
          title="编辑分类"
          onOk={this.onEditSubmit.bind(this)}
          onShowAsync={onShowAsync}
          formProvider={form => (
            <Fragment>
              <Row gutter={8}>
                <Col md={24}>
                  <Form.Item label="分类UUID">
                    {form.getFieldDecorator('uuid', {
                        initialValue:  editingClassify.uuid,
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col md={24}>
                  <Form.Item label="分类名称">
                    {form.getFieldDecorator('name', {
                        initialValue:  editingClassify.name,
                        rules: [
                          { required: true, message: '分类不为空'}
                        ]
                    })(
                      <Input placeholder="请编辑你的分类" />
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

export default EditClassify;