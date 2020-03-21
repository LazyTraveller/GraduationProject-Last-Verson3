import { message } from 'antd';
import * as  services from '../../../services/fund';
import { easyRouteTo } from '../../../utils/easyDispatch';

export default {
  namespace: 'fund',

  state: {
    fundlist: [],
    WithdrawList: {},
  },

  effects: {

    *fetchfundList(_, { call, put }) {
      const response = yield call(services.fundList);
      yield put({
        type: 'fundlist',
        payload: response,
      });
    },

    *fetchWithdrawList(_, { call,put}) {
      const response = yield call(services.WithdrawList);
      yield put({
        type: 'WithdrawList',
        payload: response,
      });
    },

    *fetchAddfund({ payload }, { call}) {
      const response = yield call(services.Addfund, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('提交成功');
      } else {
        message.error('提交失败');
      }
    },

    *fetchOnMarkFund({ payload }, {call}) {
      const response = yield call(services.OnMarkFund, payload.uuid);
      if (!response) return;
      if (response.code !== 200) {
        message.success('标记为已处理');
      } else {
        message.error('标记失败');
      }
    }
  },

  reducers: {
    fundlist(state, { payload }) {
      return {
        ...state,
        fundlist: payload,
      };
    },
    WithdrawList(state, { payload }) {
      return { 
          ...state,
           WithdrawList: payload 
        }
    },
  },
};
