import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
// import EditModal from './modals/EditOrder'

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

export default function getQrcodeColumns(props,eventHandler) {
    //  const { onMarkqrcode,GetqrcodeEdit,clearError,onEditSubmit} = eventHandler;
    const isDeal = {
        false: "已处理",
        true: "未处理",
    }
    return [
        newColumn('二维码id', 'qrcode_id'),
        newColumn('宿舍号', 'dormitory'),
        newColumn('商品','goodsname'),
        newColumn('合计费用','money'),
        {
          title: '下单时间',
          dataIndex: 'time',
          defaultSortOrder: 'descend',
          sorter: (a, b) => Date.parse(a.time) - Date.parse(b.time),
          //  render: it => {
          //   const m = moment(it);
          //   return (
          //     <span title={getDateTimeString(m)}>
          //       {m.fromNow()}
          //     </span>
          //   );
          // }
          render: it => {
            const m = moment(it);
            return (
              <span title={getDateTimeString(m)}>{m.format("YYYY-MM-DD")}&nbsp;({m.fromNow()})</span>
            )
         }
        },
        {
            align: 'right',
            title: `操作`,
            key: 'op',
            fixed: 'right',
            render: it => {
                return(
                  <Fragment>
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


