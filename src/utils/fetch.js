import qs from 'qs';
import { notification } from 'antd';

// 强制退出
function passiveLogout() {
  // @HACK
  /* eslint-disable no-underscore-dangle */
  window.g_app._store.dispatch({
    type: 'login/logout',
  });
  notification('warning', '警告' ,'Cookie失效,请重新登陆')
}

/**
 * @param {boolean} true => response.json() false => response
 * @param {string} method
 * @param {string} url
 * @param {any} body
 * @param {any} header {string: value}
 */
export default async function request(isJSON, method, url, body, header) {
  const promiseNull = Promise.resolve([]);
  const headers = Object.assign(
    {},
    {
      'Content-Type': 'application/json',
    },
    header
  );

  let options = null;
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    body = qs.stringify(body);
  } else {
    body = JSON.stringify(body);
  }
  options = Object.assign(
    {},
    {
      method,
    },
    {
      body,
      credentials: 'include',
    },
    {
      headers,
    }
  );

//   let status = '';

  if (isJSON) {
    return fetch(url, options)
      .then(response => {
      const status = response.status;
        if (status !== 200 && status !== 302) {
          passiveLogout();
          return promiseNull;
        }
        return response.json();
      })
      .then(res => res);
  }
  return fetch(url, options).then(response => response);
}


