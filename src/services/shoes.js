import request from '@/utils/request';
import { stringify } from 'qs';
import _ from 'lodash';



/** @param {string|number} id */
export function checkUpdateModeById(id) {
    //@ts-ignore
    return (typeof id === 'number' && id >= 0) || (parseInt(id, 10) >= 0);
  }

// 未处理列表
export async function orderList() {
  return request('/sms-1.0.0/user/list');
}

// 已处理
export async function pendedList() {
  return request('/sms-1.0.0/user/pended');
}

// 鞋子类型列表
export async function shoesList() {
    return request('/sms-1.0.0/admin/list');
  }

// 添加或编辑鞋子类型
export async function createOrUpdateShoes(values) {
  
    const body = _.pick(values,
        'images','money','types','textarea');
     return request(`/sms-1.0.0/admin/add`,{ method:'post',  data: {body},
   });


    // if (!checkUpdateModeById(uuid)) {
    //     return request(`POST /sms-1.0.0/admin/add/`, { body });
    // }
    // return request(`POST /sms-1.0.0/admin/edit/${uuid}`,{ body });

}


// 更新接口
export async function UpdateShoes(uuid,values) {
  // console.warn('11111111111111111111111111111111111',values);
  const body = _.pick(values,
    'images','money','types','textarea');
  return request(`/sms-1.0.0/admin/edit/${uuid}`,{ method: 'post', data: {body} });
}

  // 删除鞋子类型
export async function deleteshoes(uuid) {
    // console.warn('services got the uuid',uuid)
    return request(`/sms-1.0.0/admin/delete?uuid=${uuid}`);
}

