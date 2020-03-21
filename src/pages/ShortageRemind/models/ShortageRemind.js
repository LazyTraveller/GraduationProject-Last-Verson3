import { message } from 'antd';
import * as  services from '../../../services/ShortageRemind';
import { easyRouteTo } from '../../../utils/easyDispatch';

const defaultGoBack = {
  router: '/ShortageRemind/ShortageRemindList',
  title: '缺货提醒列表',
}

export default {
  namespace: 'ShortageRemind',

  state: {
    remindlist: {},
  },

  effects: {
    // 获取提醒列表
    *fetchRemindList(_, { call, put }) {
      const response = yield call(services.RemindList);
      yield put({
        type: 'RemindList',
        payload: response,
      });
    },


    // 添加缺货提醒
    *fetchRemindAdd({ payload }, { call, put}) {
    
      const response = yield call(services.RemindAdd, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('添加成功');
        easyRouteTo(this, defaultGoBack.router);
      } else {
        message.error('添加失败');
      }
    },

    // 删除缺货提醒
    *fetchRemindDelete({ payload }, { call}) {
      const response = yield call(services.RemindDelete, payload.uuid);
      if (!response) return;
      if (response) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    },

    // 标记缺货
    *fetchMarkRemind({ payload }, { call }) {
      const response = yield call(services.onMarkRemind, payload.uuid);
      if (!response) return;
      if (response.code !== 200) {
        message.success('标记为已处理');
      } else {
        message.error('标记失败');
      }
    },





  },

  reducers: {
    RemindList(state, { payload }) {
      return {
        ...state,
        remindlist: payload,
      };
    },
  },
};
