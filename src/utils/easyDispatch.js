//@ts-check
//@ts-ignore
import { routerRedux } from 'dva/router';
import _ from 'lodash';

function safeFunction() { }

/**
 * 使用方法(this 必须含有 props.dispatch 方法):
 * easyDispatch(this, 'global/fetchUser', {onError: ...});
 *
 * @param {any} thisContext
 * @param {string} type
 * @param {any} payload
 */
export function easyDispatch(thisContext, type, payload = {}) {
  _.get(thisContext, 'props.dispatch', safeFunction)({ type, payload });
}

/**
 * 使用方法(this 必须含有 props.dispatch 方法):
 * easyRouteTo(this, 'user/login');
 *
 * @param {any} thisContext
 * @param {string} routePath
 */
export function easyRouteTo(thisContext, routePath) {
  _.get(thisContext, 'props.dispatch', safeFunction)(routerRedux.push(routePath));
}
