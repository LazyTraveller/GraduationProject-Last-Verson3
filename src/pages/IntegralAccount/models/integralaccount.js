import { message } from 'antd';
import * as  services from '../../../services/integralaccount';
import { easyRouteTo } from '../../../utils/easyDispatch';


export default {
  namespace: 'IntegralAccount',

  state: {
    integralaccountListlist: [],
    MemberRechargeList: []
  },

  effects: {
    // 获取积分会员列表
    *fetchintegralaccountList({ payload }, { call, put }) {
      const response = yield call(services.integralaccountList, payload);
      yield put({
        type: 'integralaccountList',
        payload: response,
      });
    },

      // 会员充值记录列表
    *fetchMemberRechargeList({ payload }, { call, put }) {
      const response = yield call(services.MemberRechargeList, payload);
      yield put({
        type: 'MemberRechargeList',
        payload: response,
      });
    },


    // 根据号码，微信昵称，查询
    *Queryintegralaccount({ payload }, { call, put }) {
      const response = yield call(services.GetintegralaccountByNameorPlone, payload);
      if (!response) return;
      if (response === []) {
        message.error('查无此人');
      } else {
        message.success('查询成功');
      }
      yield put({
        type: 'Queryintegralaccount',
        payload: response,
      });
    },

       // 根据号码，微信昵称，查询
       *fetchInvestMember({ payload }, { call, put }) {
         console.warn('values', payload)
        const response = yield call(services.GetInvestMemberByNameorPlone, payload);
        if (!response) return;
        if (response === []) {
          message.error('查无此人');
        } else {
          message.success('查询成功');
        }
        yield put({
          type: 'Queryintegralaccount',
          payload: response,
        });
      },

       // 删除会员记录
       *fetchInvestMemberDelete({ payload }, { call}) {
        const response = yield call(services.InvestMemberDelete, payload.uuid);
        if (!response) return;
        if (response) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
      },

  },

  reducers: {
    // 列表返回的数据
    integralaccountList(state, { payload }) {
      return {
        ...state,
        integralaccountListlist: payload,
      };
    },

     MemberRechargeList(state, { payload }) {
      return {
        ...state,
        MemberRechargeList: payload,
      };
    },

    // 搜索返回的数据
    Queryintegralaccount(state, { payload }) {
      return { ...state, integralaccountListlist: payload }
    },
  },
};
