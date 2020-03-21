import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Chart, Geom, Axis, Tooltip,Label} from "bizcharts";
import { Card,Icon , Col, Row, Form, Input, DatePicker, Popconfirm, Button, message, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import PiaChartModal4 from './modals/PiaChartModal4';
import PiaChartModal3 from './modals/PiaChartModal3';
import PiaChartModal6 from './modals/PiaChartModal6';

const { RangePicker } = DatePicker;
const defaultGoBack = {
  router: '/SnackOrderManager/SnackOrderList',
  title: '订单列表',
}

function removeEmptyArrayEle(arr){    
  for(let i = 0; i < arr.length; i++) {
   if(arr[i] === "") {
      arr.splice(i,1);
      i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                       // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
    }
   }
   return arr;
};

function getCount(arr) {
  const obj = {};
  let k; 
  for (let i = 0, len = arr.length; i < len; i++) {
    k = arr[i][0];
    if (obj[k]) {
      obj[k] +=parseInt(arr[i][1], 10);
    } else {
      obj[k] = 1;
    }
  }
  return obj;
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
      startTime: [],
      endTime: [],
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
      type: 'home/fetchSnacksOrderList'
    });
    dispatch({
      type: 'home/fetchEverydayData'
    });
  }


  render() {
    const { isSaving, home} = this.props;
    const { startTime, endTime } = this.state;
    
    const orderList = Array.isArray(home.orderList) > 0 ? home.orderList : [];
    const EveryDayData = Array.isArray(home.EveryDayData) > 0 ? home.EveryDayData : [];
    const weekdata1 = [];
    const weekdata2 = [];
    EveryDayData.map(it => {
      weekdata1.push(_.pick(it, 'day', 'number'));
      weekdata2.push(_.pick(it, 'day', 'money'));
    })
    // console.warn("weekdata1",weekdata1);
    // console.warn("weekdata2",weekdata2);
    const getTimeAndMoney = [];
    const getSancks = [];
    let sumMoneyYA = 0;
    let  bigSancksFamily = [];
    let SancksStr = '';
    orderList.map(it => {
      getTimeAndMoney.push(_.pick(it, 'time', 'money'));
      getSancks.push(_.pick(it, 'goodsname'));
      sumMoneyYA += _.get(it, 'money');

    });
    let sumMoney = 0;
    orderList.map(it => {
      if (Date.parse(_.get(it, 'time')) >= Date.parse(startTime) && Date.parse(_.get(it, 'time')) <= Date.parse(endTime)) {
        sumMoney += _.get(it, 'money');
      }
  });
  getSancks.map((it)=> {
    SancksStr += it.goodsname + "+";
  });
    // console.warn('SancksStr',SancksStr)
  bigSancksFamily = SancksStr.split('+');
  const empty = removeEmptyArrayEle(bigSancksFamily);
  const sum = [];
  empty.map(it => {
    sum.push(it.split('x'));
  })
  // console.warn('sum',sum);
  // console.warn("getCount",getCount(sum));
  // console.warn('empty',empty);
  const pieChartData = getCount(sum);
  // const pieChartData = empty.reduce((allNames, name) => {
  //   if (name in allNames) {
  //      allNames[name]++;
  //   } else {
  //     allNames[name] = 1;
  //   }
  //   return allNames;
  // }, {});
  //  console.warn('pieChartData',pieChartData)
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

  const data = [
    {
      year: "该段时间交易总额(RMB)",
      sales: sumMoney.toFixed(2),
    },
  ];
  const cols = {
    sales: {
      tickInterval: 600,
    }
  };

    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent=''>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;零趣盒子数据监控</span>} style={{ marginBottom: 30 }} extra={extra}>
          
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <PiaChartModal4 title="每天订单数量监控图" weekdata={weekdata1} />
            </Col>
            <Col md={12} sm={24}>
              <PiaChartModal3 title="每天消费金额监控图" weekdata={weekdata2} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col md={24} sm={24} style={{ marginTop: 40 }}>
              <PiaChartModal6 pieChartData={pieChartData} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col md={24} sm={24}>
              <span style={{ fontSize: 18, color: 'red', fontFamily: 'YouYuan'}}>累计销售额：{sumMoneyYA.toFixed(2)}</span>
            </Col>
            <Col md={24} sm={24} style={{  textAlign: 'center', marginTop: 40, }}>
              <Icon type="line-chart" /><span style={{ color: 'black', fontSize: 18, fontFamily: 'YouYuan'}}>账单分析</span><br />
              <span style={{ marginTop: 10 }}>(推荐格式：2019-07-11 00:00 ~ 2019-08-23 23:59)</span><br />
              <RangePicker 
                showTime={{ format: 'HH:mm', defaultValue: '00:00'}}
                format="YYYY-MM-DD HH:mm"
                onChange={this.onChange}
                style={{ marginTop: 10, marginBottom: 15 }} 
                placeholder={["选择开始日期时间",'选择结束日期时间']} 
              />
              <Chart height={400} data={data} scale={cols}>
                <Axis name="year" />
                <Axis name="sales" />
                <Tooltip
                  crosshairs={{
                       type: "rect"
                  }}
                />
                <Geom type="interval" position="year*sales" />
              </Chart>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default Monitoring;


