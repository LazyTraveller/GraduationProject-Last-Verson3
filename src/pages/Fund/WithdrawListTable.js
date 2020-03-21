import React, { Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {Icon} from 'antd';

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

function getFundColumns(props, eventHandler) {
    const { clearError, OnMarkFund  } = eventHandler;
    return [
        newColumn('uuid', 'uuid'),
        newColumn('分店名称', 'name'),
        newColumn('提现资金', 'money'),
        newColumn('原来总资金', 'summoney'),
        newColumn('剩余总资金', 'leftmoney'),
       
       {
           title: '时间',
           dataIndex: 'time',
           defaultSortOrder: 'descend',
           sorter: (a,b) => Date.parse(a.time) - Date.parse(b.time),
          render: it => {
             const m = moment(it);
             return (
               <span title={getDateTimeString(m)}>{m.format("YYYY-MM-DD")}&nbsp;({m.fromNow()})</span>
             )
          }
           
       },
       newColumn('申请状态', 'status', it => ( it === "true" ? (<span style={{ color: '#00994d' }}>审核通过</span>) : (<span style={{ color: '#ff1a1a'}}>审核中</span>))),
        {
            align: 'right',
            title: '操作',
            key: 'op',
            render: it => {
                return (
                  <Fragment>
                    {
                      it.status === "false" ? (
                        <a
                          style={{ color: 'd9d9d9', marginRight: 10 }}
                          onClick={OnMarkFund.bind(this, _.get(it, 'uuid', ''))}
                        >
                          <Icon type="check-circle" />&nbsp;&nbsp;&nbsp;标记已处理 
                        </a>
                          ) : null
                    }
                
                  </Fragment>
                );
            }
        }
    ];
}

export default getFundColumns;