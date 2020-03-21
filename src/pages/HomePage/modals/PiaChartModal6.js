import React, { Fragment } from 'react';
import { Button, Modal, Alert, Icon } from 'antd';
import _ from 'lodash';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from '../../../common/importEcharts';

/**
 * @augments {React.PureComponent<{
    loadingPieChart: boolean;
    pieChartData: any;
    onQueryChartData: () => any;
  }, {}>}
 */
export default class PiaChartModal6 extends React.PureComponent {
  state = {
    visable: false,
  };

  //   onClickShow = () => {
  //     this.setState({ visable: true });
  //     const { onQueryChartData } = this.props;
  //     // onQueryChartData();
  //   }

  //   onClickHide = () => {
  //     this.setState({ visable: false });
  //   }

  render() {
    const { loadingPieChart, pieChartData } = this.props;
    const A = _.entries(pieChartData);
    A.map((key, values) => ({
      name: key,
      value: values,
    }));
    return (
      <Fragment>
        {/* <Button type="primary" icon="pie-chart" onClick={this.onClickShow}>统计</Button> */}
        {/* <Modal
          title="设备故障维修统计图"
          visible={this.state.visable}
          onCancel={this.onClickHide}
          onOk={this.onClickHide}
          footer={null}
          width="40%"
          maskClosable={false}
        > */}
        {typeof pieChartData === 'object' ? (
          <Fragment>
            {[
              {
                text: '零食种类消费统计',
                legend: _.keys(pieChartData),
                data: A.map((key, values) => ({ value: values, name: key })),
              },
            ].map(it => (
              <ReactEchartsCore
                showLoading={loadingPieChart}
                echarts={echarts}
                notMerge
                lazyUpdate
                style={{ height: 600 }}
                option={{
                  title: {
                    text: '零食种类消费统计',
                    x: 'center',
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)',
                  },
                  legend: {
                    orient: "vertical",
                    left: "left",
                    type: "scroll",
                    data: it.legend,
                    // selectedMode: false,
                  },
                  series: [
                    {
                      name: '零食种类消费统计',
                      type: 'pie',
                      radius: '55%',
                      center: ['50%', '50%'],
                      data: _.entries(pieChartData).map((key) => ({ name: key[0],  value: key[1] })),
                      label: {
                        normal: {
                          formatter: '{b} : {c|{c}} ({d}%)',
                          rich: {
                            c: {
                              fontSize: 16,
                              color: '#eee',
                              backgroundColor: '#334455',
                              padding: [2, 4],
                              borderRadius: 2,
                            },
                          },
                        },
                      },
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                      },
                    },
                  ],
                }}
              />
            ))}
          </Fragment>
        ) : (
          <Alert message="数据加载失败" type="error" />
        )}
        {/* </Modal> */}
      </Fragment>
    );
  }
}
