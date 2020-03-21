import { message } from 'antd';
import { ApplyList } from '../../../services/ApplicationBox';
import { RemindList } from '../../../services/ShortageRemind';
import { QrcodeList } from '../../../services/qrcode';
import { SnacksOrderList, GetSelectByEveryDay } from '@/services/snackorder';

export default {
  namespace: 'home',

  state: {
    Applylist: [],
    remindlist: {},
    Qrcodelist: [],
    orderList: [],
    EveryDayData: [],
    
  },

  effects: {
   // 获取申请盒子列表
   *fetchApplyList(_, { call, put }) {
    const response = yield call(ApplyList);
    yield put({
      type: 'ApplyList',
      payload: response,
    });
  },

  // 获取零食订单列表
  *fetchSnacksOrderList(_, { call, put }) {
    const response = yield call(SnacksOrderList);
    yield put({
      type: 'SnacksOrderList',
      payload: response,
    });
  },

   // 获取提醒列表
   *fetchRemindList(_, { call, put }) {
    const response = yield call(RemindList);
    yield put({
      type: 'RemindList',
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

  *fetchEverydayData(_, { call, put }) {
    const response = yield call(GetSelectByEveryDay);
    yield put({
      type: 'EveryDayData',
      payload: response,
    });
  }

  

  },

  reducers: {
    ApplyList(state, { payload }) {
      return {
        ...state,
        Applylist: payload,
      };
    },

    RemindList(state, { payload }) {
      return {
        ...state,
        remindlist: payload,
      };
    },

    QrcodeList(state, { payload }) {
      return {
        ...state,
        Qrcodelist: payload,
      };
    },
    SnacksOrderList(state, { payload }) {
      return {
        ...state,
        orderList: payload,
      };
    },

    EveryDayData(state, { payload }) {
      return {
        ...state,
        EveryDayData: payload,
      }
    }


  },
};
