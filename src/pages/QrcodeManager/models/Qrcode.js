import { message } from 'antd';
import * as  services from '../../../services/qrcode';
import { easyRouteTo } from '../../../utils/easyDispatch';
import { SnackList } from '../../../services/snack';

const defaultGoBack = {
  router: '/QrcodeManager/QrcodeList',
  title: '宿舍二维码绑定列表',
}

export default {
  namespace: 'qrcode',

  state: {
    Qrcodelist: [],
    gotEditQrcode: {},
    snackList: {},
  },

  effects: {
    // 获取绑定列表
    *fetchQrcodeList(_, { call, put }) {
      const response = yield call(services.QrcodeList);
      yield put({
        type: 'QrcodeList',
        payload: response,
      });
    },


    // 添加二维码绑定
    *fetchQrcodeAdd({ payload }, { call, put}) {
     
      const response = yield call(services.QrcodeAdd, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('添加成功');
        easyRouteTo(this, defaultGoBack.router);
      } else {
        message.error('添加失败');
      }
    },

    // 删除绑定
    *fetchQrcodeDelete({ payload }, { call}) {
      const response = yield call(services.QrcodeDelete, payload.uuid);
      if (!response) return;
      if (response) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    },

    // 标记二维码已处理
    *fetchQrcodeOnmark({ payload }, { call }) {
      const response = yield call(services.onMarkQrcode, payload.uuid);
      if (!response) return;
      if (response.code !== 200) {
        message.success('标记为已处理');
      } else {
        message.error('标记失败');
      }
    },
    
    // 根据UUID查询编辑的信息
    *fetchQrcodeByUUID({ payload }, { call, put }) {
      const response = yield call(services.searchQrcodeByUUID, payload);
      if (!response) return;
      yield put({
        type: 'gotEditQrcode',
        payload: response,
      });
    },


    // 提交修改后的信息
    *fetchQrcodeEdit({ payload }, { call }) {
      const response = yield call(services.QrcodeEdit, payload);
      if (!response) return;
      if (response.code !== 200) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    },

    // 根据宿舍号查询
    *fetchQueryQrcodeBydormitory({ payload }, { call, put }) {
      const response = yield call(services.GetQrcodeBydormitory, payload);
      if (!response) return;
      if (response === []) {
        message.error('查无此宿舍');
      } else {
        message.success('查询成功');
      }
      yield put({
        type: 'QueryQrcodeData',
        payload: response,
      });
    },
       // 零食列表
       *fetchSnackList(_, { call, put }) {
        const response = yield call(SnackList);
        yield put({
          type: 'snackList',
          payload: response
        });
        
      },

  },

  reducers: {
    QrcodeList(state, { payload }) {
      return {
        ...state,
        Qrcodelist: payload,
      };
    },
    gotEditQrcode(state, { payload }) {
     
      return { ...state, gotEditQrcode: payload }
    },

    QueryQrcodeData(state, { payload }) {
      
      return { ...state, Qrcodelist: payload }
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
