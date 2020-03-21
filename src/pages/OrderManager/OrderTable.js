import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import EditModal from './modals/EditOrder'

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

function getDateTimeString(msTimeOrDate) {
  if (msTimeOrDate === null) return null;
  if (msTimeOrDate && typeof msTimeOrDate === 'object') {
    if ('format' in msTimeOrDate && typeof msTimeOrDate.format === 'function')
      return msTimeOrDate.format(DATE_TIME_FORMAT);

    if (msTimeOrDate instanceof Date) return moment(msTimeOrDate).format(DATE_TIME_FORMAT);
  }
  // @ts-ignore
  return moment(new Date(msTimeOrDate)).format(DATE_TIME_FORMAT);
}


function newColumn(title, dataIndex, render = undefined ) {
    return { title, dataIndex, render, key: dataIndex };
}

export default function getOrderColumns(props,eventHandler) {
     const { onMarkOrder,onEditOrder,clearError,onEditSubmit} = eventHandler;
    const isDeal = {
        false: "已处理",
        true: "未处理",
    }
    return [
        // newColumn('订单编号', 'uuid'),
        newColumn('客户名称', 'username'),
        newColumn('客户电话', 'phone'),
        newColumn('服务类型','types'),
        newColumn('取鞋时间','take_time'),
        newColumn('送鞋时间', 'send_time'),
        newColumn('合计费用', 'money'),
        newColumn('数量','sum'),
        {
          title: '下单时间',
          dataIndex: 'time',
          defaultSortOrder: 'descend',
          sorter: (a, b) => Date.parse(a.time) - Date.parse(b.time),
           render: it => {
            const m = moment(it);
            return (
              <span title={getDateTimeString(m)}>
                {m.fromNow()}
              </span>
            );
          }
        },
        newColumn('订单状态','status', it => (<span style={{ color: '#ff0000'}}>{it}</span>)),
        {
            align: 'right',
            title: `操作  (鞋子放进鞋柜才标记)`,
            key: 'op',
            render: it => {
                return(
                  <Fragment>
                    {
                      it.status === '订单中' ? (
                        // 父组件
                        <EditModal 
                          onShowAsync={clearError}
                          onOk={onEditSubmit}
                        >
                          <a 
                            style={{ marginLeft: 50 }} 
                            onClick={onEditOrder.bind(this, _.get(it,'uuid',''))} >
                            <Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;
                          </a>
                        </EditModal>
                      ): null
                    }
                    {
                      it.status === "订单中" ? (
                        <a 
                          style={{ color: "d9d9d9", marginRight: 10 }}
                          onClick={onMarkOrder.bind(this, _.get(it, 'uuid', ''))} >
                          <Icon type="check-circle" />&nbsp;&nbsp;&nbsp;标记已处理
                        </a>
                      ) : null
                    }
                    <Popconfirm
                      title={<span>确定删除该订单？<br /></span>}
                      okType="danger"
                      onConfirm={eventHandler.onDeleteOrder.bind(null, it)}
                      okText="确认删除"
                      cancelText="取消"
                    >
                      <a style={{ color: '#FC1E39', marginLeft: 20 }}>
                        <Icon type="delete" />&nbsp;删除
                      </a>
                    </Popconfirm>
                  </Fragment>
                )
            }
        }


    ];
}


