import { message } from 'antd';
import * as services from '../../../services/shoes';
import { easyRouteTo } from '../../../utils/easyDispatch';

const defaultGoBack = {
    router: '/shoestypes/shoeslist',
    title: '鞋子列表',
}

export default {
    namespace: 'shoes',

    state: {
        shoesList: {},
        
    },

    effects: {
         // 列表
        *fetchShoesTypes(_, { call, put }) {
            const response = yield call(services.shoesList);
           
            yield put({
                type: 'save',
                payload: response,
            });
        },

        // 添加
        *fetchCreateOrUpdateShoes({ payload }, {call}) {
            const response = yield call(services.createOrUpdateShoes(payload));
           
            if(!response)
              return;
            if (response.code !== 200) {
                message.error('添加失败！');
            } else {
                message.success('添加成功！');
                easyRouteTo(this,defaultGoBack.router);
               
            };   
        },
        
        // 修改
        *fetchUpdateShoes({ payload }, { call }) {
            const response = yield call(services.UpdateShoes(payload.uuid));
            
        },

        // 删除
        *fetchdeleteShoes({ payload }) {
           
            const response =yield services.deleteshoes(payload.uuid);
           
            
            if (!response) return;
            if (response.code !== 200) {
                message.success('删除成功！');
            } else {
                message.error('删除失败！');

            }


        }


    },
    
    reducers: {
        save( state, { payload }) {
           
            return {
                ...state,
                shoesList: payload
            }
        },
       


    }

}