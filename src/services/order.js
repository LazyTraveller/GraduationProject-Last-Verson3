import request from '@/utils/request';
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';


// 未处理列表
export async function orderList() {
  return request('/sms-1.0.0/user/list');
}

// 已处理
export async function pendedList() {
  return request('/sms-1.0.0/user/pended');
}
// 添加订单
export async function orderAdd(values) {
    // console.warn("servies" , values);
    const body = _.pick(values, "address","money","phone",
    "send_time","sum","take_time","textarea","types","username");
    // console.warn("body",body);
    return request(`/sms-1.0.0/user/add?${stringify(body)}`,{ method:'POST'});
  }
// 删除未处理订单
export async function orderDelete(uuid) {
  
    return request(`/sms-1.0.0/user/delete?uuid=${uuid}`);
  }

  // 删除已处理订单
  export async function DeletePendingOrder(uuid) {
    return request(`/sms-1.0.0/user/delete_depend?uuid=${uuid}`)
  }

// 查询编辑的那条信息
export async function searchbyUUID(uuid) {
  return request(`/sms-1.0.0/user/get_by_uuid?uuid=${uuid}`);
}


  // 编辑订单
export async function orderEdit(values) {
  // console.warn('CCCCCCCCCCCCCCCCCCCCCCCCC',values);
    return request(`/sms-1.0.0/user/edit?${stringify(values)}`,{ method: 'POST'});
}
// 标记已处理订单
export async function onMarkOrder(uuid) {

 return request(`/sms-1.0.0/user/pending?uuid=${uuid}`);
}


// 查询未处理订单
export async function queryByNameOrPhone(values) {
  // if (!values) return;
  if (values.phone === undefined && values.username !== undefined) {
    return request(`/sms-1.0.0/user/username_search?username=${values.username}`);
  }
  // return request(`/sms-1.0.0/user/username_search?username=${values.username}`);
  return request(`/sms-1.0.0/user/phone_search?phone=${values.phone}`);
}

// 查询已处理订单
export async function queryPendingByNameOrPhone(values) {
  // console.warn('services values', values)
  if (values.phone === undefined && values.username !== undefined) {
    return request(`/sms-1.0.0/user/username_search_depend?username=${values.username}`);
  }
  return request(`/sms-1.0.0/user/phone_search_depend?phone=${values.phone}`);
}


