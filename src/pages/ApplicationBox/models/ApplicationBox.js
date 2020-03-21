import { message } from 'antd';
import * as  services from '../../../services/ApplicationBox';
import { easyRouteTo } from '../../../utils/easyDispatch';

const defaultGoBack = {
  router: '/ApplicationBox/ApplicationBoxList',
  title: '申请盒子列表',
}

export default {
  namespace: 'ApplicationBox',

  state: {
    Applylist: [],
    gotEditApply: {},
  },

  effects: {
    // 获取申请盒子列表
    *fetchApplyList(_, { call, put }) {
      const response = yield call(services.ApplyList);
      yield put({
        type: 'ApplyList',
        payload: response,
      });
    },


    // 添加申请盒子
    *fetchApplyAdd({ payload }, { call, put}) {
     
      const response = yield call(services.ApplyAdd, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('添加成功');
        easyRouteTo(this, defaultGoBack.router);
      } else {
        message.error('添加失败');
      }
    },

    // 删除盒子申请
    *fetchApplyDelete({ payload }, { call}) {
      const response = yield call(services.ApplyDelete, payload.uuid);
      if (!response) return;
      if (response) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    },

    // 标记已处理
    *fetchApplyRemind({ payload }, { call }) {
      const response = yield call(services.onMarkApply, payload.uuid);
      if (!response) return;
      if (response.code !== 200) {
        message.success('标记为已处理');
      } else {
        message.error('标记失败');
      }
    },
    
    // 根据UUID查询编辑的信息
    *fetchApplyByUUID({ payload }, { call, put }) {
      // console.warn('model uuid', payload)
      const response = yield call(services.searchByUUID, payload);
      if (!response) return;
      yield put({
        type: 'gotEditApply',
        payload: response,
      });
    },


    // 提交修改后的信息
    *fetchApplyEdit({ payload }, { call}) {
      const response = yield call(services.ApplyEdit, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    },

    // 根据宿舍号查询
    *fetchQueryApplyByAddress({ payload }, { call, put }) {
      const response = yield call(services.GetApplyByAddress, payload);
      if (!response) return;
      if (response === []) {
        message.error('查无此宿舍');
      } else {
        message.success('查询成功');
      }
      yield put({
        type: 'QueryApplyData',
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
    gotEditApply(state, { payload }) {
      return { ...state, gotEditApply: payload }
    },

    QueryApplyData(state, { payload }) {
      
      return { ...state, Applylist: payload }
    },
  },
};
