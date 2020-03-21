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

export default class PiaChartModal extends PureComponent {
  state = {
    orderBy: 'type',
  };

  toggleOrderBy = orderBy => this.setState({ orderBy });
  
  render() {
    const { Alength, Blength, title } = this.props;
    const data = {
        未处理: Alength,
        已处理: Blength,
        总数: Alength+Blength,
    }
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
          style={{ height: 250 }}
          option={{
            title: {
            //   text: '订单数量',
              x: 'center',
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c} 条",
            },
            legend: {
              orient: "vertical",
              left: "left",
              type: "scroll",
              data: _.keys(data),
              // selectedMode: false,
            },
            color: CHART_COLORS,
            series: [
              {
                name: {title},
                type: 'pie',
                radius: '60%',
                center: ['60%', '50%'],
                data: _.keys(data).map(it => ({ name: it, value: data[it] })),
                itemStyle: {
                  emphasis: {
                    shadowBlur: 5,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          }}
        />
      </Card>
    );
  }
}
