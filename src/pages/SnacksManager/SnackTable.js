import React, { Fragment } from 'react';
import _ from 'lodash';
import { Icon,Popconfirm,Modal } from 'antd';
import moment from 'moment';
import EditSnacks from './modals/EditSnacks';

function showImage(url) {
  Modal.info({
    title: "零食详图",
    content: <img src={url} alt={url} style={{ width: "80%" }} />,
    width: window.innerWidth * 0.4,
  });
}

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

function getSnackColumns(props, eventHandler) {
    const { clearError, onEditSubmit,getEditSnack } = eventHandler;
    const { snacks } = props;
    const classifylist = Array.isArray(snacks.classifylist) ? snacks.classifylist : [];
    // console.warn('classifylist',classifylist);
    let b = [];
    let obj = {};
    classifylist.map( it => {
      b.push(_.pick(it,'uuid','name'));
    });
    b.map((e) => {
      obj[e.uuid] = e.name;
    });
    // console.warn('b', b);
    // console.warn('obj',obj);
    return [
        {
            title: '零食照片',
            dataIndex: 'images',
            key: `uuid`,
            render: src => src ? <img src={src} alt="logo" style={{width: '100%', maxWidth: 64}} onClick={showImage.bind(this, src)} /> : '暂无照片'
        },
        newColumn('零食名称', 'name'),
        // newColumn('零食分类uuid', 'classify_uuid'),
        {
          title: '零食种类',
          dataIndex: 'classify_uuid',
          render: it => (
            <span>{obj[it]}</span>
          ),
        },
        newColumn('零食价格', 'money'),
        {
            title: '发布时间',
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
        {
            align: 'right',
            title: '操作',
            key: 'op',
            render: it => {
                return (
                  <Fragment>
                    <Popconfirm
                      title={<span>确认删除<b>{it.name}</b>吗？</span>}
                      okType="danger"
                      onConfirm={eventHandler.onDeleteSnack.bind(null,it)}
                      okText="确认删除"
                      cancelText="取消"
                    >
                      <a style={{ color: '#FC1E39', marginLeft: 20 }}>
                        <Icon type="delete" />&nbsp;删除&nbsp;
                      </a> 
                    </Popconfirm>
                    <EditSnacks
                      onShowAsync={clearError}
                      onOk={onEditSubmit}
                    >
                      <a
                        style={{ marginLeft: 50 }}
                        onClick={getEditSnack.bind(this, _.get(it, 'uuid',''))}
                      >
                        <Icon type="edit" />&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;
                      </a>
                    </EditSnacks>
                  </Fragment>
                );
            }
        }
    ];
}

export default getSnackColumns;

