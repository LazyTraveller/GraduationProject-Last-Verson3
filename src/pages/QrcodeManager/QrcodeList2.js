import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Card,
  Icon,
  Col,
  Row,
  Form,
  Input,
  Table,
  Popconfirm,
  Button,
  Badge,
  Modal,
  Drawer,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import getQrcodeColumns from './QrcodeTable2';

const defaultGoBack = {
  router: '/QrcodeManager/AddQrcode',
  title: '去绑定宿舍二维码',
};

@connect(({ qrcode, loading }) => ({
  qrcode, // 这里要改
  isSaving: loading.effects['qrcode/fetchQrcodeList'], // 这里要改
  loading: loading.models.qrcode,
}))
@Form.create()
class QrcodeManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formValues: {},
      visible: false,
    };
  }

  componentDidMount() {
    this.query();
  }

  onDeleteqrcode(it) {
    if (!it) return;
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/fetchQrcodeDelete',
      payload: { uuid: it.uuid },
    });
    this.query();
  }

  onMarkqrcode(uuid) {
    const { dispatch } = this.props;

    dispatch({
      type: 'qrcode/fetchQrcodeOnmark',
      payload: { uuid },
    });
    this.query();
  }

  onEditSubmit(values) {
    const { dispatch } = this.props;
    const sendValues = Object.assign({}, values);

    dispatch({
      type: 'qrcode/fetchQrcodeEdit',
      payload: { ...sendValues },
    });
    this.query();
    this.query();
  }

  getEditQrcode(uuid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/fetchQrcodeByUUID',
      payload: uuid,
    });
    dispatch({
      type: 'qrcode/fetchSnackList',
    });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValues) => {
      if (err) return;
      if (fieldsValues.address === undefined) {
        this.query();
      }
      this.setState({
        formValues: { ...fieldsValues },
      });
      dispatch({
        type: 'qrcode/fetchQueryQrcodeBydormitory',
        payload: { ...fieldsValues },
      });
    });
  };

  requery = () => {
    this.query();
  };

  query() {
    this.clearError();
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/fetchQrcodeList',
    });
  }

  clearError() {
    this.setState({ error: '' });
  }

  GetqrcodeEdit(uuid) {
    const { dispatch } = this.props;

    dispatch({
      type: 'qrcode/fetchQrcodeByUUID',
      payload: uuid,
    });
  }

  render() {
    const { isSaving, qrcode, loading, form } = this.props;
    const { error } = this.state;
    const Qrcodelist = Array.isArray(qrcode.Qrcodelist) > 0 ? qrcode.Qrcodelist : [];

    let count = 0;
    const ShortageSuShe = [];
    Qrcodelist.map(it => {
      if (_.get(it, 'status') === false) {
        count++;
        
      }
        if (it.leftmoney < it.summoney * 0.6 ) {
            ShortageSuShe.push(it);
        }
    });
    // console.warn("Qrcodelist",Qrcodelist)
    // console.warn("ShortageSuShe",ShortageSuShe)

    const content = (
      <Button
        type="primary"
        onClick={ev => {
          ev.preventDefault();
          easyRouteTo(this, defaultGoBack.router);
        }}
      >
        <Icon type="left" />
        {defaultGoBack.title}
      </Button>
    );

    const tableColumns = getQrcodeColumns(
      { qrcode },
      {
        onMarkqrcode: this.onMarkqrcode.bind(this),
        onDeleteqrcode: this.onDeleteqrcode.bind(this),
        onEditSubmit: this.onEditSubmit.bind(this),
        clearError: this.clearError.bind(this),
        GetqrcodeEdit: this.GetqrcodeEdit.bind(this),
        getEditQrcode: this.getEditQrcode.bind(this),
      }
    );

    const submitText = (
      <div style={{ marginTop: 43 }}>
        <Col md={8} sm={24}>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            查询
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

    const renderClassifyFilter = (
      <Form onSubmit={this.handleSearch} layout="horizontal" style={{ marginBottom: 10 }}>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="宿舍号筛选">
              {form.getFieldDecorator('address', {
                rules: [{ message: '请输入需要查询的宿舍号' }],
              })(<Input placeholder="宿舍号关键字" />)}
            </Form.Item>
          </Col>
          {submitText}
          <Col md={8} sm={24}>
            <span style={{ color: '#e60000' }}>
              <Icon type="twitter" />
              &nbsp;&nbsp;未绑定二维码总数：
              <Badge count={count} />
            </span>
          </Col>
        </Row>
      </Form>
    );

    const extra = (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          重要提示
        </Button>
        <Drawer
          title="温馨提示"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <p>
            <big>一、编辑的使用：</big>
          </p>
          <p>
            1.当确定哪个宿舍与该二维码绑定的时候，则需要进行编辑操作，修改宿舍号，确定信息准确无误后提交信息，以至二维码与该宿舍绑定成功。
          </p>
          <p>
            2.当宿舍完成缺货补给后，需要查询找到该宿舍号，进行编辑操作，修改初始零食总金额和剩余零食金额，操作比较重要，切记补货后手动初始化金额。
          </p>
          <p>
            <big>二、标记绑定操作：</big>
          </p>
          <p>及时处理标记绑定操作即可，以致该宿舍与指定的二维码进行绑定。</p>
          <p>
            <big>三、零食储备状态说明：</big>
          </p>
          <p>两种状态：正常供货和严重缺货</p>
          <p>
            规则原理：根据宿舍剩余的金额等于总金额的百分之六十来判断，如果低于60%则显示严重缺货，在没有收到该宿舍被动的缺货提醒后，则需要主动给该宿舍进行上门补货；如果高于60%则显示零食供给正常。
          </p>
        </Drawer>
      </div>
    );

    return (
      // <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
      <Card
        bordered={false}
        title={
          <span>
            <Icon type="unordered-list" />
            缺货宿舍有---{ShortageSuShe.length}个
          </span>
        }
        error={error}
        extra={extra}
      >
        {renderClassifyFilter}
        <Table
          loading={loading}
          columns={tableColumns}
          rowKey={record => record.uuid}
          dataSource={ShortageSuShe}
          pagination={{ defaultPageSize: 10, showQuickJumper: true }}
          size="middle"
          components={this.components}
          scroll={{ x: 1500 }}
        />
      </Card>
      // </PageHeaderWrapper>
    );
  }
}
export default QrcodeManager;
