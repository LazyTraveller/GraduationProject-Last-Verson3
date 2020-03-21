
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  零食分类列表
export async function ClassifyList() {
    return request('/snackstest/Classify/Get_All_Classify');

}

// 添加零食分类
export async function ClassifyAdd(values) {
    // console.warn('service values',values);
    return request(`/snackstest/Classify/Add_Classify?name=${values}`,{ method:'POST'});
}

// 删除零食分类
export async function ClassifyDelete(uuid) {
    return request(`/snackstest/Classify/Delete_Classify?uuid=${uuid}`);
  }

  // 获取编辑的分类
  export async function GetClassifyWithUUID(uuid) {
    return request(`/snackstest/Classify/get_Classify?uuid=${uuid}`);
  }

  // 提交编辑好零食分类
export async function ClassifyUpdate(values) {
    // console.warn('service values',values);
    const body = _.pick(values, "name", "uuid");
    // console.warn('service body',body);
    return request(`/snackstest/Classify/Update_Classify?${stringify(body)}`,{ method:'POST'});
}



