
import _ from 'lodash';
import { stringify } from 'qs';
import request from '@/utils/request';

// 列表
export  async function wechatList() {
    return request(`/sms-1.0.0/admin/list_home`);
}

// 添加
export  async function AddWeChat(values) {
    const body = _.pick(values,'images','money','types','textarea');
    return request(`/sms-1.0.0/admin/add_home`, { method: 'post', data: { body }});
}

// 删除
export async function deleteWeChat(uuid) {
    return request(`/sms-1.0.0/admin/delete_home?uuid=${uuid}`);
}