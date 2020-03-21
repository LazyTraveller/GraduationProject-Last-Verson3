
import request from '@/utils/request';

// 分店销售额
export async function fundList() {
    return request('/zhuhaiweb/Fund/SelectAllFund');
}

// 提交申请金额
export async function Addfund(values) {
    return request(`/zhuhaiweb/Withdraw/InsertWitgdraw?money=${values.money}`,{ method:'POST'});
}

// 提现记录状态
export async function WithdrawList() {
    return request(`/zhuhaiweb/Withdraw/SelectAllWidthdraw`);
}


// 标记已处理
export async function OnMarkFund(uuid) {
    return request(`/zhuhaiweb/Withdraw/UpdateWithdraw?uuid=${uuid}`, { method:'POST'});
}





