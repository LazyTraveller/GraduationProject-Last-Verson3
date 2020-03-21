import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row,Col } from 'antd';
import _ from 'lodash';
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
import DataSet from "@antv/data-set";


@connect(({ shoeschart, loading}) => ({
    shoeschart,
    loadingList: loading.effects['shoeschart/fetchShoesTypes']
}))
class ShoesChart extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'shoeschart/fetchShoesTypes',
        });
    }

    render() {
        const { shoeschart } = this.props;
        const shoesList = Array.isArray(shoeschart.shoesList) > 0 ? shoeschart.shoesList : [];
       

        const { DataView } = DataSet;
        const data1 = [];
        shoesList.forEach(it => data1.push({item: it.types, count: 1, money: it.money}));
        const dv = new DataView();
        dv.source(data1).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
          });
          const cols = {
            percent: {
              formatter: val => {
                val = parseInt(val * 100) + "%";
                return val;
              }
            }
          };
         
        return(
          <div>
            <Row gutter={16}>
              <Col span={8} offset={11}>
                <span style={{ fontSize: 20 }}>鞋子类型分析图</span>
              </Col>
            </Row>
            <Chart
              height={window.innerHeight}
              data={dv}
              scale={cols}
              padding={[80, 100, 80, 80]}
            
              title="鞋子类型分析图"
            >
              <Coord type="theta" radius={0.75} />
              <Axis name="percent" />
              <Legend
                position="right"
                offsetY={-window.innerHeight / 2 + 120}
                offsetX={-100}
              />
              <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value} | 数量：{title}</li>"
              />
              <Geom
                type="intervalStack"
                position="percent"
                color="item"
                tooltip={[
                  "item*percent",
                  (item, percent,count,money) => {
                    percent = percent * 100 + "%";
                    return {
                      name: item,
                      value: percent,
                      title: count,
                      sum: money,
                    };
                  }
                ]}
                style={{
                  lineWidth: 1,
                  stroke: "#fff"
                }}
              >
                <Label
                  content="percent"
                  formatter={(val, item) => {
                    return item.point.item + ": " +val;
                  }}
                />
              </Geom>
            </Chart>
          </div>
        );
    }
}

export default ShoesChart;

