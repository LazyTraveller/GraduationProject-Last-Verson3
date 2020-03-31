
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  零食列表
export async function SnackList() {
    return request('/snackstest/Goods/Get_All_Goods');
}

// 添加零食
export async function SnackAdd(values) {
   
    const body = _.pick(values, 'name', 'money','images', 'classify_uuid');
    
    return request(`/snackstest/Goods/Add_Goods`,{ method:'POST',data: {values}});
}

// 删除零食分类
export async function SnackDelete(uuid) {
    return request(`/snackstest/Goods/Delete_Goods?uuid=${uuid}`);
  }

  // 获取编辑的零食
export async function GetSnacksWithUUID(uuid) {
   
    return request(`/snackstest/Goods/get_Goods?uuid=${uuid}`);
  }

  // 提交编辑好零食
export async function SnacksUpdate(values) {
    
    const body = _.pick(values, "uuid","name", "money","classify_uuid","images");
   
    return request(`/snackstest/Goods/Update_Goods?${stringify(body)}`,{ method:'POST'});
}



