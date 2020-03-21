//@ts-check
/// <reference path="../../../types.d.ts" />

import React from 'react';
import { Modal, Form } from 'antd';

/**
 * @augments {React.Component<{
    onOk: (values: {[key: string]: any}, callback: Function) => any;
    title: any;
    maskClosable?: boolean;
    width?: number;
    formProvider: (form: AntdForm) => any;
    formClassName?: string;
    form?: any;
    onShow?: Function;
    onShowAsync?: Function;
  }, {}>}
 */
//@ts-ignore
@Form.create()
 class FormSubmitModal extends React.Component {
  state = {
    visible: false,
    loading: false,
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    const { form, onShow, onShowAsync } = this.props;
    if (onShow) onShow();
    else if (onShowAsync) setTimeout(() => onShowAsync(), 15);

    form.resetFields();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk,form } = this.props;
    const callback = (close = true) => {
      this.setState({ loading: true });
      if (close) setTimeout(this.hideModelHandler.bind(this), 15);
    };
     form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: false });
        onOk(values, callback);
      }
    });
  };

  render() {
    const { children, form, title, formProvider, formClassName, width, maskClosable } = this.props;

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={title}
          width={width}
          maskClosable={maskClosable}
          visible={this.state.visible}
          onOk={this.okHandler.bind(this)}
          onCancel={this.hideModelHandler}
          confirmLoading={this.state.loading}
        >
          <Form className={formClassName}>{this.state.visible ? formProvider(form) : null}</Form>
        </Modal>
      </span>
    );
  }
}

export default FormSubmitModal;
