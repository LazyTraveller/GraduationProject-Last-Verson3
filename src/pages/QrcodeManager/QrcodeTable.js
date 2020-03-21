import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import EditQrcode from './modals/EditQrcode';
import EditQrcode1 from './modals/EditQrcode1'

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
     const { onMarkqrcode,getEditQrcode,clearError,onEditSubmit, onEditQrcode} = eventHandler;
    const isDeal = {
        false: "已处理",
        true: "未处理",
    }
    return [
        // newColumn('订单编号', 'uuid'),
        newColumn('二维码id', 'qrcode_id'),
        newColumn('宿舍号', 'dormitory'),
        newColumn('总共金额','summoney'),
        {
          title: '已消费金额',
          render: it => {
            return (
              <Fragment>
                {(it.summoney - it.leftmoney).toFixed(2)}
              </Fragment>
            )
          }
        },
        newColumn('剩余金额','leftmoney'),
        {
          title: '时间',
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
        newColumn('二维码状态','status', it => ( it === true ? (<span style={{ color: '#00994d' }}>已绑定</span>) : (<span style={{ color: '#ff1a1a'}}>未绑定</span>))),
        {
          title: '零食储备状态',
          render: it => {
            return (
              <Fragment>
                {it.leftmoney < it.summoney * 0.6 ? (<span style={{color: '#ff1a1a' }}>严重缺货</span>) : (<span style={{ color: '#00994d' }}>供货正常</span>)}
              </Fragment>
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
                  
                    {/* <EditQrcode1 
                      onShowAsync={clearError}
                      onOk={onEditSubmit}
                    >
                      <a 
                        style={{ marginLeft: 10 }} 
                        onClick={getEditQrcode.bind(this, _.get(it,'uuid',''))} >
                        <Icon type="rocket" />&nbsp;&nbsp;补货
                      </a>
                    </EditQrcode1> */}
                    <EditQrcode 
                      onShowAsync={clearError}
                      onOk={onEditSubmit}
                    >
                      <a 
                        style={{ marginLeft: 20 }} 
                        onClick={getEditQrcode.bind(this, _.get(it,'uuid',''))} >
                        <Icon type="edit" />&nbsp;编辑&nbsp;&nbsp;
                      </a>
                    </EditQrcode>
                    {
                      it.status === false ? (
                        <a
                          style={{ color: 'd9d9d9', marginRight: 10 }}
                          onClick={onMarkqrcode.bind(this, _.get(it, 'uuid', ''))}
                        >
                          <Icon type="check-circle" />&nbsp;&nbsp;&nbsp;标记为已绑定 
                        </a>
                          ) : null
                    }
                    <Popconfirm
                      title={<span>确定删除该订单？<br /></span>}
                      okType="danger"
                      onConfirm={eventHandler.onDeleteqrcode.bind(null, it)}
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


