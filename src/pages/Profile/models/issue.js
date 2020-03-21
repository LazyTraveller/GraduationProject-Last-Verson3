import { message } from 'antd';
import * as services from '@/services/issue';

export default {
  namespace: 'issue',

  state: {
    showIssue: {},
  },

  effects: {

    // 公告列表
    *fetchIssueList(_, { call, put }) {
      const response = yield call(services.IssueList);
      yield put({
        type: 'showIssue',
        payload: response,
      });
    },

    // 删除公告
    *fetchIssueDelete({ payload }, { call }) {
      const response = yield call(services.DeleteIssue, payload.uuid);
      if (!response) return;
      if (response.code !== 200 ) {
          message.success('删除成功！');
      } else {
          message.error('删除失败！');
      }
    },

    // 添加公告
    *fetchIssueAdd({ payload }, { call }) {
      // console.warn('models', payload);
      const response = yield call(services.AddIssue(payload));
      if (!response) return;
            if (response.code !== 200) {
                message.success('下单成功');
            } else {
                message.error('下单失败');
            }
    },
  },

  reducers: {
    showIssue(state, { payload }) {
      return {
        ...state,
        showIssue: payload,
      };
    },
  },
};
