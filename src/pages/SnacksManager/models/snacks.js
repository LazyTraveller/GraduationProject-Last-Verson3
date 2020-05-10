import { message } from 'antd';
import * as  services1 from '../../../services/snack';
import * as  services2 from '../../../services/Classification';
import { easyRouteTo } from '../../../utils/easyDispatch';

const defaultGoBack = {
  router: '/SnacksManager/SnacksList',
  title: '零食列表',
}

export default {
  namespace: 'snacks',

  state: {
    classifylist: {},
    editingClassify: {},
    snackList: {},
    gotEditSnacks: {},
  },

  effects: {
    // 分类列表
    *fetchclassifyList(_, { call, put }) {
      const response = yield call(services2.ClassifyList);
      yield put({
        type: 'showClassify',
        payload: response,
      });
    },
    // 添加分类
    *fetchclassifyAdd({ payload }, { call}) {
     
      const response = yield call(services2.ClassifyAdd, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('添加成功');
      } else {
        message.error('添加失败');
      }
    },
    // 删除分类
    *fetchclassifyDelete({ payload }, { call }) {
      const response = yield call(services2.ClassifyDelete, payload.uuid);
      if (!response) return;
      if (response.code !== 200 ) {
          message.success('删除成功！');
      } else {
          message.error('删除失败！');
      }
    },

    // 获取编辑的分类
    *fetchclassifybyUUID({ payload }, { call, put }) {
      const response = yield call(services2.GetClassifyWithUUID, payload);
      if (!response) return;
      yield put({
        type: 'gotEditClassify',
        payload: response,
      })
    },
    *fetchSnacksByUUID({ payload }, { call, put}) {
      const response = yield call(services1.GetSnacksWithUUID, payload);
      if (!response) return;
      yield put({
        type: 'gotEditSnacks',
        payload: response,
      });
    },
    // 提交修改后的数据
    *fetchclassifyEdit({ payload }, { call }) {
      const response = yield call(services2.ClassifyUpdate, payload);
      if (!response) return;
      if (response.code !== 200) {
          message.success('修改成功');
         // easyRouteTo(this,defaultGoBack.router);
      } else {
          message.error('修改失败');
      }
    },
    *fetchSnackEdit({ payload }, { call }) {
      const response = yield call(services1.SnacksUpdate,payload);
      if(!response) return;
      if (response.code !== 200) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    },
    // 零食列表
    *fetchSnackList({ payload }, { call, put }) {
      const response = yield call(services1.SnackList);
      yield put({
        type: 'snackList',
        payload: response
      });
    },
    // 上架零食
    *fetchSnackAdd({ payload }, { call, put}) {
      const response = yield call(services1.SnackAdd, payload);
      if (!response)  return;
      if (response.code !== 200) {
        message.success('添加成功');
        easyRouteTo(this, defaultGoBack.router);
      } else {
        message.error('上架失败');
      }
    },
    // 删除零食
    *fetchSanckDelete({ payload }, { call }) {
     
      const response = yield call(services1.SnackDelete(payload.uuid));
      if (!response) return;
      if (response.code !== 200) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    }

  },

  reducers: {
    // 分类列表数据
    showClassify(state, { payload }) {
      return {
        ...state,
        classifylist: payload,
      };
    },
    // 获取编辑数据
    gotEditClassify(state, { payload }) {
      return {
        ...state,
        editingClassify: payload
      };
    },
    gotEditSnacks(state, { payload }){
      return {
        ...state,
        gotEditSnacks: payload,
      }
    },
    // 零食列表数据
    snackList(state, { payload }) {
      return {
        ...state,
        snackList: payload,
      }
    },
  },
};
