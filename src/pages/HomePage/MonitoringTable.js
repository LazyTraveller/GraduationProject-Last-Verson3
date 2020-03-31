import React from 'react';
import _ from 'lodash';

function newColumn(title, dataIndex, render = undefined ) {
    return { title, dataIndex, render, key: dataIndex };
}

function getColumns(props, eventHandler) {
    const isDeal = {
        false: '已处理',
        true: '未处理',
    }
    return [
        {
            title: '零食名称',
            dataIndex: 'goodsname',
            width: 300,
        },
        {
            title: '销售金额/元',
            dataIndex: 'money',
            defaultSortOrder: 'descend',
            width: 300,
            sorter: (a, b) => a.money - b.money,
        },
        {
            title: '销售数量/件',
            dataIndex: 'count',
            width: 300,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.count - b.count,
        },
    ];
}

export default getColumns;