import request from '@/utils/request';
import { stringify } from 'qs';
import _ from 'lodash';

// 公告列表
export  async function IssueList() {
    return request(`/snackstest/Discount/getAll`);
}

// 添加公告
export  async function AddIssue(values) {
    const body = _.pick(values,'announcement', 'discount');
    // console.warn('services', body);
    return request(`/snackstest/Discount/add?${stringify(body)}`, { method: 'post'});
}

// 删除公告
export async function DeleteIssue(uuid) {
    return request(`/snackstest/Discount/delete?uuid=${uuid}`);
}