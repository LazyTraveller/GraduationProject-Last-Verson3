import { message } from 'antd';
import * as services from '../../../services/wechat';
import { easyRouteTo } from '../../../utils/easyDispatch';

const defaultGoBack = {
    router: '/profile/basic',
    title: '鞋子列表',
}

export default {
    namespace: 'wechat',

    state: {
        wechatList: {},
        
    },

    effects: {
        *fetchWeChatList(_,{ call, put}) {
            const response = yield call(services.wechatList);

            yield put({
                type: 'save',
                payload: response,
            });
        },
        *fetchAddWeChat({ payload }, { call}) {
            const response = yield call(services.AddWeChat(payload));

            if (!response)
             return;
            if (response) {
                message.success('添加成功');
                easyRouteTo(this, defaultGoBack.router);

            } else {
                message.error('添加失败');
            }
        },
        *fetctDeleteShoes({ payload }) {
            const response = yield services.deleteWeChat(payload.uuid);
            if (!response) return;
            if (response) {
                message.success('删除成功');
            } else {
                message.error('删除失败');
            }
        }
    },

    reducers: {
        save( state, { payload }) {
            return {
                ...state,
                wechatList: payload,
            }
        }
    }

}