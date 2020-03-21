import React, { Fragment } from 'react';
import { Row, Col, Form, Select, Button, Input } from 'antd';

export default function renderOrderFilter ( form ) {
    const submitText =  '查询';
    return (
      <Fragment>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="名字筛选">
              {form.getFieldDecorator('username', {
              })(<Input placeholder="客户名字关键字" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="电话筛选">
              {form.getFieldDecorator('phone', {
              })(<Input placeholder="客户电话关键字" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={8}>
            <Button type="primary" htmlType="submit">{submitText}</Button>
          </Col>
        </Row>
      </Fragment>
    );
}