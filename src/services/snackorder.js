import { stringify } from 'qs';
import _ from 'lodash';
import request from '@/utils/request';
import { urlencoded } from '@/utils/urlencoded';


//  零食订单列表
export async function SnacksOrderList() {
    return request('/snackstest/Snacks_Order/GetAll_Snacks_Order_Bypage?pages=1&number=10', { method:'POST'});

}

// 添加订单
export async function SnacksOrderAdd(values) {
   
    const body = _.pick(values, "Qrcode_id","goodsname","money");
   
    return request(`/snackstest/Snacks_Order/Add_Snacks_Order?${stringify(body)}`,{ method:'POST'});
}

// 删除订单
export async function SnacksOrderDelete(uuid) {
    return request(`/snackstest/Snacks_Order/delete_Snacks_Order?uuid=${uuid}`);
  }

// 查找订单
export async function GetSnacksOrderBydormitory(values) {
    return request(`/snackstest/Snacks_Order/GetAll_Snacks_Order_By?dormitory=${values.dormitory}`);
}

// 查询最近7天的订单和金额
export async function GetSelectByEveryDay() {
    return request(`/snackstest/Snacks_Order/select_by_everyday`);
}

