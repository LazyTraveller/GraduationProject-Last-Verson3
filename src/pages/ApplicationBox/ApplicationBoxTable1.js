import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon, Popconfirm } from 'antd';
import moment from 'moment';
import EditApplyModal from './modal/EditApply';

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

function getApplyColumns(props, eventHandler) {
    const { onMarkApply, onEditSubmit, clearError ,GetApplyEdit } = eventHandler;
    const isDeal = {
        false: '已处理',
        true: '未处理',
    }
    return [
        newColumn('姓名', 'name'),
        newColumn('电话', 'phone'),
        newColumn('宿舍号', 'address'),
        newColumn('学号', 'sno'),
        newColumn('性别', 'sex'),
       {
           title: '提醒时间',
           dataIndex: 'time',
           defaultSortOrder: 'descend',
           sorter: (a,b) => Date.parse(a.time) - Date.parse(b.time),
          //  render: it => {
          //      const m= moment(it);
          //      return (
          //        <span title={getDateTimeString(m)}> 
          //          {m.fromNow()}
          //        </span>
          //      );

          //  }
          render: it => {
             const m = moment(it);
             return (
               <span title={getDateTimeString(m)}>{m.format("YYYY-MM-DD")}&nbsp;({m.fromNow()})</span>
             )
          }
           
       },
        newColumn('申请状态', 'status', it => ( it === true ? (<span style={{ color: '#00994d' }}>已处理</span>) : (<span style={{ color: '#ff1a1a'}}>未处理</span>))),
        {
            align: 'right',
            title: '操作',
            key: 'op',
            render: it => {
                return (
                  <Fragment>
                    {
                      it.status === false ? (
                        <a
                          style={{ color: 'd9d9d9', marginRight: 10 }}
                          onClick={onMarkApply.bind(this, _.get(it, 'uuid', ''))}
                        >
                          <Icon type="check-circle" />&nbsp;&nbsp;&nbsp;标记已处理 
                        </a>
                          ) : null
                    }
                    {/* <EditApplyModal
                      onShowAsync={clearError}
                      onOK={onEditSubmit}
                    >
                      <a
                        style={{ marginLeft: 50 }}
                        onClick={GetApplyEdit.bind(this,_.get(it, 'uuid', ''))}
                      ><Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;</a>
                    </EditApplyModal> */}
                    <Popconfirm
                      title={<span>确认删除<b>{it.name}</b>的申请吗？</span>} 
                      okType="danger"
                      onConfirm={eventHandler.onDeleteApply.bind(null, it)}
                      okText="确实删除"
                      cancelText="取消"
                    >
                      <a style={{ color: '#FC1E39', marginLeft: 20 }}>
                        <Icon type="delete" />&nbsp;删除
                      </a>
                    </Popconfirm>
                  </Fragment>
                );
            }
        }
    ];
}

export default getApplyColumns;