import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon, Popconfirm} from 'antd';
import moment from 'moment';
 //import EditModal from './modals/editShoesTypes';

function newColumn(title, dataIndex, render = undefined ) {
    return { title, dataIndex, render, key: dataIndex };
}
/**
 * @param {number|Date|moment.Moment} msTimeOrDate
 * @returns {string}
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export function getDateTimeString(msTimeOrDate) {
    if (msTimeOrDate === null) return null;
    if (msTimeOrDate && typeof msTimeOrDate === 'object') {
      if ('format' in msTimeOrDate && typeof msTimeOrDate.format === 'function')
        return msTimeOrDate.format(DATE_TIME_FORMAT);
  
      if (msTimeOrDate instanceof Date) return moment(msTimeOrDate).format(DATE_TIME_FORMAT);
    }
    // @ts-ignore
    return moment(new Date(msTimeOrDate)).format(DATE_TIME_FORMAT);
  }

export default function getWeChatColumns(props, eventHandler) {
    const shoestypes = {
        
        Front: "正面皮鞋",
        Textile: "纺织面鞋",
        Lacquer: "漆面皮鞋",
        Reverse: "反面皮鞋",
            Bag: "皮包"
    }
    return [
        {
            title: '参考照片',
            dataIndex: 'images',
            key: 'uuid',
            render: src => src ? <img src={src} alt="logo" style={{width: '100%', maxWidth: 64}} /> : '暂无照片'
        },
        
        newColumn('服务类型','types'),
        newColumn('鞋子皮质','textarea'),
        newColumn('服务定价','money', it => {
            return (
                `${it}￥/双`
            );
        }),
        newColumn('发布时间', 'time', it => {
            const m = moment(it);
            return (
              <span title={getDateTimeString(m)}>
                {m.fromNow()}
              </span>
            );

        }),
        {
            align: 'rigth',
            title: '操作',
            key: 'op',
            render: it => {
                return(
                  <Fragment>
                    {/* <a style={{ marginLeft: 50 }} onClick={ev => { ev.preventDefault(); eventHandler.onEditShoesTypes(it)}}><Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;</a> */}
                    {/* <EditModal 
                      onOK={eventHandler.onEditShoesTypes(it)}
                    >
                      <a style={{ marginLeft: 50 }}><Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;</a>
                    </EditModal> */}
                    <Popconfirm
                      title={<span>确定该鞋子类型吗？<br /><b>{it.textarea}</b></span>}
                      onConfirm={eventHandler.onDeleteShoes.bind(null,it)}
                      okType="danger" 
                      okText="确认删除" 
                      cancelText="取消"
                    >
                      <a style={{ color: '#FC1E39', marginRight: 10 }}><Icon type="delete" />删除</a>
                    </Popconfirm>
                    
                  </Fragment>
                )
            }
        }
    ];
}

