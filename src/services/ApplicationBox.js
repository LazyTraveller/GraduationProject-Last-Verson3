
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  申请盒子列表
export async function ApplyList() {
    return request('/snackstest/Apply_box/GetAllApplyboxList');

}

// 添加申请盒子
export async function ApplyAdd(values) {
    
    const body = _.pick(values, "phone","name","address", "sno", "sex");
   
    return request(`/snackstest/Apply_box/Add_Apply_box?${stringify(body)}`,{ method:'POST'});
}

// 删除申请盒子
export async function ApplyDelete(uuid) {
    return request(`/snackstest/Apply_box/Delete_Apply_box?uuid=${uuid}`);
  }


  // 标记已处理
export async function onMarkApply(uuid) {
    return request(`/snackstest/Apply_box/Deal_Apply_box?uuid=${uuid}`);
}

// 查找盒子 根据宿舍号
export async function GetApplyByAddress(values) {
    return request(`/snackstest/Apply_box/Get_By_address?address=${values.address}`);
}

// 查询编辑的那条信息
export async function searchByUUID(uuid) {
    return request(`/snackstest/Apply_box/Get_Apply_box?uuid=${uuid}`);
}
// 提交编辑好的信息
export async function ApplyEdit(values) {
    const body = _.pick(values, "uuid","phone","name","address", "sno", "sex","status");
   
    return request(`/snackstest/Apply_box/Update_Apply_box?${stringify(body)}`, { method: "POST"})
}


