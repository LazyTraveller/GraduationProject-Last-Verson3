import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Card, Select } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from '../../../common/importEcharts';


const { Option } = Select;

const CHART_COLORS = [
  "#dd6b66", "#759aa0", "#e69d87",
  "#8dc1a9", "#ea7e53", "#eedd78",
  "#73a373", "#73b9bc", "#7289ab",
  "#91ca8c", "#f49f42",
];

export default class PiaChartModal3 extends PureComponent {
  state = {
    orderBy: 'type',
  };

  toggleOrderBy = orderBy => this.setState({ orderBy });

  render() {
    const { title, weekdata } = this.props;
    const timeArr = [];
    const numberArr = [];
    weekdata.map(it => {
      timeArr.push(_.get(it, 'day'));
      numberArr.push(_.get(it, 'money'));
    });
    return (
      <Card 
        title={title} 
        // style={{ margin: 5 }}
        extra={
         null
        }>
        <ReactEchartsCore
          showLoading={this.props.loading}
          echarts={echarts}
          notMerge
          lazyUpdate
          style={{ height: 350 }}
          option={{
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data:['消费金额']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : timeArr
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'消费金额',
                    type:'line',
                    stack: '总量',
                    areaStyle: {},
                    data: numberArr
                },
            ]
          }}
        />
      </Card>
    );
  }
}
