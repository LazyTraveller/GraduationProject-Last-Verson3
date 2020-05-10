
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  缺货提醒或者零食推荐列表
export async function RemindList() {
    return request('/snackstest/Advise/Get_All_Advise');
}

// 添加缺货提醒或零食推荐
export async function RemindAdd(values) {
   
    const body = _.pick(values, "remind","address","textarea","sex");
   
    return request(`/snackstest/Advise/Add_Advise?${stringify(body)}`,{ method:'POST'});
}

// 删除缺货提醒或零食推荐条目
export async function RemindDelete(uuid) {
    return request(`/snackstest/Advise/Delete_Advise?uuid=${uuid}`);
  }


  // 标记提交的提醒
export async function onMarkRemind(uuid) {
    return request(`/snackstest/Advise/Deal_Advise?uuid=${uuid}`);
}


