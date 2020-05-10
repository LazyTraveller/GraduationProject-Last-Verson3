import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Line } from '@antv/g2plot';
import { Chart, Geom, Axis, Tooltip,Label} from "bizcharts";
import { Card,Icon , Col, Row, Form, Input, DatePicker, Table, Button, message, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import PiaChartModal4 from './modals/PiaChartModal4';
import PiaChartModal3 from './modals/PiaChartModal3';
import getColumns from './MonitoringTable';

const { RangePicker } = DatePicker;
const defaultGoBack = {
  router: '/SnackOrderManager/SnackOrderList',
  title: '订单列表',
}





@connect(({ home, loading }) => ({
    home, // 这里要改
  isSaving: loading.effects['home/fetchSnacksOrderList'],// 这里要改
  loading: loading.models.issue,
}))
@Form.create()
class Monitoring extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  componentDidMount() {
    this.query();
  }

  onChange = (value, dataString) => {
    this.setState({
        startTime: dataString[0],
        endTime: dataString[1],
    })
}

reqquery = () => {
  this.query();
  message.success('刷新成功');
}

  query() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchSnacksStatistics'
    });
    dispatch({
      type: 'home/fetchEverydayData'
    });
  }


  render() {
    const { isSaving, home, loading } = this.props;
    // const { } = this.state;
    
    const SnacksStatistics = Array.isArray(home.SnacksStatistics) > 0 ? home.SnacksStatistics : [];
    const EveryDayData = Array.isArray(home.EveryDayData) > 0 ? home.EveryDayData : [];
    const weekdata1 = [];
    const weekdata2 = [];
    EveryDayData.map(it => {
      weekdata1.push(_.pick(it, 'day', 'number'));
      weekdata2.push(_.pick(it, 'day', 'money'));
    })

    let totalSales = 0;
    SnacksStatistics.map(it => {
      totalSales += _.get(it, 'money');
    })

  const extra = (
    <Button type="primary" onClick={this.reqquery}>刷新数据</Button>
  );

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

  const Columns = getColumns(
    { home },
    {

    }
  )

  
  // const data = [
  //   { year: '1991', value: 3 },
  //   { year: '1992', value: 4 },
  //   { year: '1993', value: 3.5 },
  //   { year: '1994', value: 5 },
  //   { year: '1995', value: 4.9 },
  //   { year: '1996', value: 6 },
  //   { year: '1997', value: 7 },
  //   { year: '1998', value: 9 },
  //   { year: '1999', value: 13 },
  // ];
  
  // const linePlot = new Line('canvas', {
  //   data,
  //   xField: 'year',
  //   yField: 'value',
  // });
  // linePlot.render();

    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;零食订单数量金额监控</span>} style={{ marginBottom: 30 }} extra={extra}>
          
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <PiaChartModal4 title="每天订单数量监控图" weekdata={weekdata1} />
            </Col>
            <Col md={12} sm={24}>
              <PiaChartModal3 title="每天消费金额监控图" weekdata={weekdata2} />
            </Col>
          </Row>
  
        </Card>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;零食种类消费统计</span>} style={{ marginBottom: 30 }} extra={extra}>
          <Table
            loading={loading}
            columns={Columns}
            rowKey={record => record.uuid}
            dataSource={SnacksStatistics}
            pagination={{"defaultPageSize":10, showQuickJumper: true }}
            size="middle"
            components={this.components}
            footer={() => `销售总额为：${totalSales.toFixed(2)}￥`}
            bordered
          />
          {/* <Divider /> */}
          {/* 每月的销售额和累计的销售额 */}
        </Card>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;每月的销售额和累计的销售额</span>} style={{ marginBottom: 30 }} extra={extra}>
          {/* <div id="canvas">bb</div> */}
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default Monitoring;


