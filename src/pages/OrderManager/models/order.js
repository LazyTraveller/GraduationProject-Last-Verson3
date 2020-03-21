import { message } from 'antd';
import * as services from '../../../services/order';
import { shoesList } from '../../../services/shoes';
import { easyRouteTo } from '../../../utils/easyDispatch';
import { wechatList } from '../../../services/wechat';
import { IssueList } from '../../../services/issue';

const defaultGoBack = {
    router: '/order/user-order',
    title: '订单列表',
}

export default {
    namespace: 'order',

    state: {
        orderList: {},
        pendList: {},
        shoesList: {},
        basicList: {},
        editingOrder: null,
        showIssue: {},
      
    },

    effects: {
        
        // 未处理
        *fetchOederList(_, { call, put }) {
            const response = yield call(services.orderList);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        // 已处理
        *fetchPengingList(_, { call, put }) {
            const response = yield call(services.pendedList);
            yield put({
                type: 'pend',
                payload: response,
            })

        },
        // 删除未处理订单
        *fetchDeleteOeder({ payload }, { call }) {
            const response = yield call(services.orderDelete, payload.uuid);
            if (!response) return;
            if (response.code !== 200 ) {
                message.success('删除成功！');
            } else {
                message.error('删除失败！');
            }
        },

        // 删除已处理订单
        *fetchDeletePengingOrder({ payload }, { call}) {
            const response = yield call(services.DeletePendingOrder, payload.uuid);
            if (!response) return;
            if (response) {
                message.success('删除成功');
            } else {
                message.error('删除失败');
            }
        },
        
        // 添加订单
        *fetchcreateOrder({ payload }, {call}) {
            const response = yield call(services.orderAdd, payload);
            if (!response) return;
            if (response.code !== 200) {
                message.success('下单成功');
                easyRouteTo(this,defaultGoBack.router);
            } else {
                message.error('下单失败');
            }

        },
        // 将未处理的订单标记为已处理订单
        *fetchonMarkOrder({payload}, {call}) {
           
            const response = yield call(services.onMarkOrder,payload.uuid);

            if (!response) return;
            if (response.code !==200) {
                message.success('已标记处理');
            } else {
                message.error('标记失败');
            }
        },


        // 查询未处理订单
        *fetchqueryByNameOrPhone({ payload }, { call, put }) {
           
            const response = yield call(services.queryByNameOrPhone, payload);
           
            if (!response) return;
            if (response === []) {
                message.error('查无此人');
            } else {
              message.success('查询成功');
            }
            yield put({
                type: 'searchList',
                payload: response,
            })

        },
        // 查询已处理订单
        *fetchqueryPendingByNameOrPhone({ payload}, { call, put}) {
            // console.warn('pending payload',payload)
            const response = yield call(services.queryPendingByNameOrPhone, payload);
            if (!response) return;
            if (response === []) {
                message.error('查无此人');
            } else {
                message.success('查询成功');
            }
            yield put({
                type: 'pendingsearchList',
                payload: response,
            })
        },
        // 获取鞋子的基本服务
        *fetchShoesTypes(_, { call, put }) {
            const response = yield call(shoesList);
          
            yield put({
                type: 'shoesList',
                payload: response,
            });
       },
       // 获取鞋子护理服务
       *fetchBasicServices(_, { call, put }) {
           const response = yield call(wechatList);

           yield put({
               type: 'basicList',
               payload: response,
           })
        },
        // 动态获取寄存点数据
        *fetchIssueList(_, { call, put }) {
            const response = yield call(IssueList);
            yield put({
                type: 'showIssue',
                payload: response,
            });
        },
        // 获取编辑的订单号信息
       *fetchOrderbyUUID({ payload }, { put,call }) {
        const response = yield call(services.searchbyUUID,payload);
        if (!response) return;
        yield put({
            type: 'gotEditOrder',
            payload: response,
        })

    },
     // 编辑后的订单信息提交的接口
    *fetchOrderEdit({ payload }, {call}) {
        // console.warn("BBBBBBBBBBBBBBBBBBBBBBB",payload);
        const response = yield call(services.orderEdit(payload));
        if (!response) return;
        if (response === '修改成功') {
            message.success('修改成功');
           // easyRouteTo(this,defaultGoBack.router);
        } else {
            message.error('修改失败');
        }
    }
    
},
    
    reducers: {
        // 未处理订单的数据
        save( state, { payload }) {
           
            return {
                ...state,
                orderList: payload
            }
        },
        // 已处理订单的数据
        pend( state, { payload }) {

            return {
                ...state,
                pendList: payload,
            }
        },
        // 鞋子护理服务类型
        shoesList(state, { payload }) {
            return {
                ...state,
                shoesList: payload,
            }
        },
        // 未处理订单查询数据
        searchList(state, { payload }) {
            return {
                ...state,
                orderList: payload,
            }
        },
        // 已处理订单查询数据
        pendingsearchList( state, { payload }) {
            return {
                ...state,
                pendList: payload,
            }

        },
        // 需要编辑的订单数据
        gotEditOrder( state, { payload }) {
          
            return { ...state, editingOrder: payload }
        },
        // 基本服务类型
        basicList( state, { payload }) {
           
            return { ...state, basicList: payload, }
        },
        // 寄存点数据
        showIssue(state, { payload }) {
            return {
                ...state,
                showIssue: payload,
            }
        }

    }

}