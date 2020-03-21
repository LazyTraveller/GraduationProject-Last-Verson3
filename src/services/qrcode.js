
import { stringify } from 'qs';
import _ from 'lodash';
import { urlencoded } from '@/utils/urlencoded';
import request from '@/utils/request';

//  二维码绑定列表
export async function QrcodeList() {
    return request('/snackstest/Qrcode/GetAll_QrcodeListBypages?pages=1&number=10', { method:'POST'});

}

// 添加二维码绑定
export async function QrcodeAdd(values) {
   
    const body = _.pick(values, "Qrcode_id","dormitory","leftmoney", "summoney");
   
    return request(`/snackstest/Qrcode/Add_Qrcode?${stringify(body)}`,{ method:'POST'});
}

// 删除二维码绑定
export async function QrcodeDelete(uuid) {
    return request(`/snackstest/Qrcode/Delete_Qrcode?uuid=${uuid}`);
  }


  // 标记已处理二维码
export async function onMarkQrcode(uuid) {
   
    return request(`/snackstest/Qrcode/Deal_Qrcode?uuid=${uuid}`);
}

// 查找绑定
export async function GetQrcodeBydormitory(values) {
    return request(`/snackstest/Qrcode/Get_Qrcode_by_dormitory?dormitory=${values.address}`);
}



// 查询编辑的那条信息
export async function searchQrcodeByUUID(uuid) {
    return request(`/snackstest/Qrcode/Get_Qrcode_by_uuid?uuid=${uuid}`);
}

// 提交编辑好的信息
export async function QrcodeEdit(values) {
   
    const body = _.pick(values, "uuid","dormitory","leftmoney", "summoney");
    return request(`/snackstest/Qrcode/Update_Qrcode?${stringify(body)}`, { method: "POST"})
}


