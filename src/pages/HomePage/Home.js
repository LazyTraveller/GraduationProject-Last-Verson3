import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Card,Icon , Col, Row, Form, Input, Table, Popconfirm, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import PiaChartModal from './modals/PiaChartModal';

const defaultGoBack = {
  router: '/QrcodeManager/QrcodeList',
  title: '宿舍二维码绑定列表',
}

const defaultGoBack2 = {
  router: '/ShortageRemind/ShortageRemindList',
  title: '缺货提醒列表',
}


@connect(({ home, loading }) => ({
    home, 
  isSaving: loading.effects['home/fetchApplyList'],
  loading: loading.models.issue,
}))
@Form.create()
class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  componentDidMount() {
    this.query();
  }

  requery = () => {
    this.query();
    message.success('已最新数据!');
  }


  query() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchApplyList'
    });
    dispatch({
      type: 'home/fetchRemindList'
    });
    dispatch({
      type: 'home/fetchQrcodeList'
    });
  }

 
  render() {
    const { isSaving, home } = this.props;
    const applylist = Array.isArray(home.Applylist) > 0 ? home.Applylist : [];
    const remindlist = Array.isArray(home.remindlist) > 0 ? home.remindlist : [];
    const qrcodelist = Array.isArray(home.Qrcodelist) > 0 ? home.Qrcodelist : [];
    const applylistA = [];
    const applylistB = [];
    const remindlistA = [];
    const remindlistB = [];
    const qrcodelistA = [];
    const qrcodelistB = [];
    applylist.map(it => (
      _.get(it, 'status') === false ? applylistA.push(it) : applylistB.push(it))
    );
    remindlist.map(it => (
      _.get(it, 'status') === false ? remindlistA.push(it) : remindlistB.push(it))
    );
    qrcodelist.map(it => (
      _.get(it, 'status') === false ? qrcodelistA.push(it) : qrcodelistB.push(it))
    )

    const extraContent = (
      <Button type="primary" onClick={this.requery}>刷新数据</Button>
    )

    const content = (
      <div>
        <Button 
          icon="left" 
          onClick={ev => { ev.preventDefault(); easyRouteTo(this,defaultGoBack.router); }}
          type="primary"
       >
          {defaultGoBack.title}
        </Button>
      </div>
    );

    const content2 = (
      <div>
        <Button 
          icon="left" 
          onClick={ev => { ev.preventDefault(); easyRouteTo(this,defaultGoBack2.router); }}
          type="primary"
       >
          {defaultGoBack2.title}
        </Button>
      </div>
    );
    
 
    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={content2}>
        <Card bordered={false} title={<span><Icon type="area-chart" />&nbsp;数据统计</span>} style={{ marginBottom: 30 }} extra={extraContent}>
          <Row gutter={16}>
            <Col md={8} sm={24}><PiaChartModal title="申请盒子统计" Alength={applylistA.length} Blength={applylistB.length} /></Col>
            <Col md={8} sm={24}><PiaChartModal title="缺货提醒统计" Alength={remindlistA.length} Blength={remindlistB.length} /></Col>
            <Col md={8} sm={24}><PiaChartModal title="宿舍绑定统计" Alength={qrcodelistA.length} Blength={qrcodelistB.length} /></Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default Home;



