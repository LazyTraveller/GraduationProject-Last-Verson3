import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

@connect(({ wechat, loading}) => ({
    wechat,
    isSaving: loading.effects['wechat/fetchAddWeChat'],
}))
class CustomerServices extends Component {
    render() {
        return(
          <Card title="小程序客服留言">
            还没做
          </Card>
        );
    }
}
export default CustomerServices;