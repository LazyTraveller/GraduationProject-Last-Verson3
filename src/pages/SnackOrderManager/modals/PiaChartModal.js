
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
export default class PiaChartModal extends React.PureComponent {
  state = {
    visable: false,
  }

  onClickShow = () => {
    this.setState({ visable: true });
    const { onQueryChartData } = this.props;
     onQueryChartData();
  }

  onClickHide = () => {
    this.setState({ visable: false });
  }


  render() {
    const { loadingPieChart, pieChartData, dormitory, showSnacksOrderList } = this.props;
    // console.warn("showSnacksOrderList",showSnacksOrderList);
    let sumMoney = 0; 
    showSnacksOrderList.map(it => {
      sumMoney +=_.get(it, 'money');
    })
    // console.warn("sumMoney",sumMoney)
    const A = _.entries(pieChartData);
    return (
      <Fragment>
        <Button type="primary" icon="pie-chart" onClick={this.onClickShow}>宿舍统计</Button>
        <Modal
          title={`宿舍--${dormitory === undefined ? "总体零食消费情况" : dormitory} `}
          visible={this.state.visable}
          onCancel={this.onClickHide}
          onOk={this.onClickHide}
          footer={null}
          width="60%"
          maskClosable={false}
        >{typeof pieChartData === 'object' ? (
          <Fragment>
            {[{
              text: `宿舍零食消费统计（累积消费金额${sumMoney.toFixed(2)}）`,
              legend: _.keys(pieChartData),
              data: _.entries(pieChartData).map((key) => ({ name: key[0],  value: key[1] })),
            }, ].map(it => (
              <ReactEchartsCore
                showLoading={loadingPieChart}
                echarts={echarts}
                notMerge
                lazyUpdate
                key={it.text}
                style={{ height: 700  }}
                option={{
                  title: {
                    text: it.text,
                    x: 'center',
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)",
                  },
                  legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: it.legend,
                    // selectedMode: false,
                  },
                  series: [
                    {
                      name: it.text,
                      type: 'pie',
                      radius: '55%',
                      center: ['50%', '50%'],
                      data: _.entries(pieChartData).map((key) => ({ name: key[0],  value: key[1] })),
                      label: {
                        normal: {
                          formatter: "{b} : {c|{c}} ({d}%)",
                          rich: {
                            c: {
                              fontSize: 16,
                              color: '#eee',
                              backgroundColor: '#334455',
                              padding: [2, 4],
                              borderRadius: 2
                            },
                          },
                        }
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
        ) : <Alert message="数据加载失败" type="error" />}
        </Modal>
      </Fragment>
    );
  }
}
