import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Card, Icon, Button,DatePicker } from 'antd';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
  } from "bizcharts";
import logo from '../../assets/kb.png';


const { RangePicker } = DatePicker;

@connect(({ shoeschart, loading}) => ({
    shoeschart,
    loadingList: loading.effects['shoeschart/fetchOederList'] || loading.effects['shoeschart/fetchPengingList']
}))
class OrderAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: [],
            endTime: [],
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'shoeschart/fetchOederList',
        });
        dispatch({
            type: 'shoeschart/fetchPengingList'
        })
    }

    onChange = (value, dataString) => {
        this.setState({
            startTime: dataString[0],
            endTime: dataString[1],
        })
    }

    
    render() {
         const { shoeschart } = this.props;
         const { startTime, endTime } = this.state;
         const gridStyle = {
            width: '25%',
            height: 100,
            textAlign: 'center',
          };
         const getTimeAndMoney = [];
         const orderList = Array.isArray(shoeschart.orderList) > 0 ? shoeschart.orderList : [];
         const pendList = Array.isArray(shoeschart.pendList) > 0 ? shoeschart.pendList : [];
         orderList.map(it => {
            getTimeAndMoney.push(_.pick(it, 'time', 'money'));
         });
         pendList.map(it => {
            getTimeAndMoney.push(_.pick(it, 'time', 'money'));
         });
    
        let sumMoney1 = 0;
        orderList.map(it => {
            if (Date.parse(_.get(it, 'time')) >= Date.parse(startTime) && Date.parse(_.get(it, 'time')) <= Date.parse(endTime)) {
                sumMoney1 += _.get(it, 'money');
            }
        });
        let sumMoney2 = 0;
        pendList.map(it => {
            if (Date.parse(_.get(it, 'time')) >= Date.parse(startTime) && Date.parse(_.get(it, 'time')) <= Date.parse(endTime)) {
                sumMoney2 += _.get(it, 'money');
            }
        })
         let sum = 0;
         let sun = 0;
         let totalmoney1 = 0;
         let totalmoney2 = 0;
         orderList.map(it => {
            sum += _.get(it, 'sum');
            totalmoney1 += _.get(it, 'money');
            
         });
        
         pendList.map(it => {
             sun += _.get(it, 'sum');
             totalmoney2 += _.get(it, 'money');
         });
         const data = [
            {
              year: "该段时间交易总额(RMB)",
              sales: sumMoney1+sumMoney2
            },
          ];
          const cols = {
            sales: {
              tickInterval: 500,
            }
          };

        return(
          <Card title="鳄鱼工作室">
            <Card.Grid style={gridStyle}><Icon type="shopping" />&nbsp;&nbsp;未处理订单数：<span style={{ color: '#ff4000', fontSize: 20}}>{orderList.length}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="safety-certificate" />&nbsp;&nbsp;已处理订单数：<span style={{ color: '#00cccc',fontSize: 20}}>{pendList.length}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="dashboard" />&nbsp;&nbsp;订单总数：<span style={{ fontSize: 20}}>{orderList.length+pendList.length}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="eye" />&nbsp;&nbsp;小程序访问人数：<span style={{ fontSize: 20}}>1045</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="meh" />&nbsp;&nbsp;未洗鞋子数量：<span style={{ color: '#ff4000',fontSize: 20}}>{sum}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="smile" />&nbsp;&nbsp;已洗鞋子数量：<span style={{ color: '#00cccc',fontSize: 20}}>{sun}</span></Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center', height: 100, }}><Icon type="bar-chart" />&nbsp;&nbsp;鞋子总数量：<span style={{ fontSize: 20}}>{sum + sun}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="red-envelope" />&nbsp;&nbsp;未处理订单金额：<span style={{ color: '#ff4000',fontSize: 20}}>{totalmoney1}</span></Card.Grid>
            <Card.Grid style={gridStyle}><Icon type="money-collect" />&nbsp;&nbsp;已处理订单金额：<span style={{ color: '#00cccc',fontSize: 20}}>{totalmoney2}</span></Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center',  height: 100,}}><Icon type="pay-circle" />&nbsp;&nbsp;合计金额：<span style={{ fontSize: 20}}>{totalmoney1 + totalmoney2}</span></Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center' }}>
              <Icon type="line-chart" />账单分析：<br />
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
                     type: "y"
                  }}
                />
                <Geom type="interval" position="year*sales" />
              </Chart>
            </Card.Grid>
            {/* <Card.Grid style={{ width: '50%', textAlign: 'center'}}> <img src={logo} alt="ccc" style={{ width: 490, height: 500, }} /></Card.Grid> */}
          </Card>
        );
    }
}

export default OrderAnalysis;

