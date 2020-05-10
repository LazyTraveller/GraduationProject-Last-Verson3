import _ from 'lodash';
import { connect } from 'dva';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input } from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

@connect(({ qrcode }) => ({
  qrcode,
}))
@Form.create()
class Replenish extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onEditSubmit(values, callback) {
        const { onOk } = this.props;
        onOk(Object.assign({}, values), callback(true));
   }

    render() {
      
      const { qrcode , onShowAsync } = this.props;
      const gotEditQrcode = Object.assign({}, qrcode.gotEditQrcode);
      
      return(
        <FormSubmitModal
          title={`填写补货金额----${gotEditQrcode.dormitory}宿舍`}
          onOk={this.onEditSubmit.bind(this)}
          onShowAsync={onShowAsync}
          formProvider={form => (
            <Fragment>
              <Row gutter={8}>
                <Col md={12}>
                  <Form.Item label="补货金额">
                    {form.getFieldDecorator('replenish', {
                        rules: [
                          { required: true, message: '补货金额不为空'}
                        ]
                    })(
                      <Input placeholder="请编辑补货金额" type="number" />
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

export default Replenish;