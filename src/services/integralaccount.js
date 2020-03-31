
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  积分会员列表
export async function integralaccountList(params) {
    // console.warn('integralaccountList3', params);
    
    return request(`/snackstest/Member/GetMemberListByPage?pages=${params.page}&number=${params.results}`, { method:'POST'});
}


// //根据号码，微信昵称，查询
export async function GetintegralaccountByNameorPlone(values) {
    const body = _.pick(values, "phone","wechatName","page");
    return request(`/snackstest/Member/GetMemberListByPage?number=10&${stringify(body)}`, { method:'POST'});
}
//会员充值记录
export async function MemberRechargeList(params) {
//    console.warn('MemberRechargeList3', params);
    
    return request(`/snackstest/InvestMember/GetAllInvestMamberByPage?pages=${params.page}&number=${params.results}`, { method:'POST'});
}

//根据号码，微信昵称，查询
export async function GetInvestMemberByNameorPlone(values) {
    console.warn('values', values)
    const body = _.pick(values, "phone","wechatName");
    return request(`/snackstest/InvestMember/GetAllInvestMamberByPage?page=1&number=10&${stringify(body)}`, { method:'POST'});
}

// 删除充值记录
export async function InvestMemberDelete(uuid) {
    return request(`/snackstest/InvestMember/DeleteInvestMemberByUuid&uuid=${uuid}`, { method:'POST'});
  }