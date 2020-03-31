import { message } from 'antd';
import * as services from '@/services/snackorder';
import { QrcodeList } from '@/services/qrcode';
import { SnackList } from '../../../services/snack';
import { IssueList } from '../../../services/issue';
import { easyRouteTo } from '../../../utils/easyDispatch';


const defaultGoBack = {
  router: '/SnackOrderManager/SnackOrderList',
  title: '零食订单列表',
}

export default {
  namespace: 'snackorder',

  state: {
    showSnacksOrderList: {},
    QrcodeList: {},
    snackList: {},
    showIssue: {},
  },

  effects: {
    // 获取零食订单列表
    *fetchSnacksOrderList({ payload }, { call, put }) {
      console.warn('sanch models', payload)
      const response = yield call(services.SnacksOrderList, payload);
      yield put({
        type: 'SnacksOrderList',
        payload: response,
      });
    },
      // 获取绑定列表
      *fetchQrcodeList(_, { call, put }) {
        const response = yield call(QrcodeList);
        yield put({
          type: 'QrcodeList',
          payload: response,
        });
      },

       // 零食列表
    *fetchSnackList({ payload }, { call, put }) {
      const response = yield call(SnackList);
      yield put({
        type: 'snackList',
        payload: response
      });
    },
      // 公告列表
      *fetchIssueList(_, { call, put }) {
        const response = yield call(IssueList);
        yield put({
          type: 'showIssue',
          payload: response,
        });
      },

    // 添加零食订单
    *fetchSnacksOrderAdd({ payload }, { call, put}) {
      // console.warn('models', payload);
      const response = yield call(services.SnacksOrderAdd, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('添加成功');
        easyRouteTo(this, defaultGoBack.router);
      } else {
        message.error('添加失败');
      }
    },

    // 删除零食订单
    *fetchSnacksOrderDelete({ payload }, { call}) {
      const response = yield call(services.SnacksOrderDelete, payload.uuid);
      if (!response) return;
      if (response) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    },

      // 根据宿舍号查询
      *fetchSnacksOrderBydormitory({ payload }, { call, put }) {
       
        const response = yield call(services.GetSnacksOrderBydormitory, payload);
        if (!response) return;
        if (response === []) {
          message.error('查无此宿舍');
        } else {
          message.success('查询成功');
        }
        yield put({
          type: 'QuerySnacksOrderData',
          payload: response,
        });
      }
  },

  reducers: {
    SnacksOrderList(state, { payload }) {
      return {
        ...state,
        showSnacksOrderList: payload,
      };
    },
    QuerySnacksOrderData(state, { payload }) {
      // console.warn('model reducers payload', payload);
      return { ...state, showSnacksOrderList: payload }
    },
    QrcodeList(state, { payload }) {
      return {
        ...state,
        Qrcodelist: payload,
      };
    },
      // 零食列表数据
      snackList(state, { payload }) {
        return {
          ...state,
          snackList: payload,
        }
      },
      showIssue(state, { payload }) {
        return {
          ...state,
          showIssue: payload,
        };
      },
  },
};
