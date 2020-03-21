
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  积分会员列表
export async function integralaccountList(page) {
    console.warn('pageeee', page);
    
    return request(`/snackstest/Member/GetMemberListByPage?page=1&number=10`, { method:'POST'});
}


// //根据号码，微信昵称，查询
export async function GetintegralaccountByNameorPlone(values) {
    const body = _.pick(values, "phone","wechatName","page");
    return request(`/snackstest/Member/GetMemberListByPage?number=10&${stringify(body)}`, { method:'POST'});
}
//会员充值记录
export async function MemberRechargeList(page) {
   console.warn('pageeee', page);
    
    return request(`/snackstest/InvestMember/GetAllInvestMamberByPage?page=1&number=10`, { method:'POST'});
}

// //根据号码，微信昵称，查询
// export async function GetMemberRechargeByNameorPlone(values) {
//     const body = _.pick(values, "phone","wechatName","page");
//     return request(`/snackstest/Member/GetMemberListByPage?number=10&${stringify(body)}`, { method:'POST'});
// }