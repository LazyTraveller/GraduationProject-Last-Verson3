import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import router from 'umi/router';
import { fakeAccountLogin, LoginOut } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 登录成功
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response === true) {
        reloadAuthorized();
        message.success('登录成功');
        router.push('/HomePage/Home');
       
      } else {
        message.error('用户名或密码错误');
        router.push('/user/login');
       
        // reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     redirect = null;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
        
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
        
        // reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     redirect = null;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
      
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    // *LoginOut(_, { call, put }) {


    // },
  
    // 退出登录
    *logout(initiative, { put }) {
      if (initiative) 
      LoginOut();
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: {
      //     status: false,
      //     currentAuthority: 'guest',
      //   },
      // });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
