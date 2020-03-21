import { shoesList } from '../../../services/shoes';
import * as services from '../../../services/order';

export default {
    namespace: 'shoeschart',

    state: {
        orderList: {},
        pendList: {},
        shoesList: {},
    },

    effects: {

     *fetchShoesTypes(_, { call, put }) {
            const response = yield call(shoesList);
          
            yield put({
                type: 'shoesList',
                payload: response,
            });
    },

    // 未处理
     *fetchOederList(_, { call, put }) {
       const response = yield call(services.orderList);
    

       yield put({
        type: 'save',
        payload: response,
       });
   },

   // 已处理
   *fetchPengingList(_, { call, put }) {
       const response = yield call(services.pendedList);
      
       yield put({
           type: 'pend',
           payload: response,
       });
   },
},
  


    reducers: {
        shoesList(state, { payload }) {
            return {
                ...state,
                shoesList: payload,
            }
        },
        save(state, { payload }) {
            return {
                ...state,
                orderList: payload
            }
        },
        pend(state, { payload }) {
          
            return {
                ...state,
                pendList: payload,
            }
        },
    }
}