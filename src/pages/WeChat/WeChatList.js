import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Table, Card, Input, Row, Col, Button, message} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import getWeChatColumns from './WeChatTable';
import { easyDispatch ,easyRouteTo} from '../../utils/easyDispatch';

@connect(({ wechat,loading }) => ({
  wechat,
    loadingList: loading.effects['wechat/fetchWeChatList'],
}))

class WeChatList extends Component {
  state = {
    error: '',
  }

   componentDidMount() {
     this.query();
   }

   onDeleteShoes(shoesList) {
    if (!shoesList) return;
    this.clearError();
    // console.warn('page got the uuid', shoesList.uuid)
    const { dispatch } = this.props;
    dispatch({
      type: 'wechat/fetctDeleteShoes',
      payload: { uuid: shoesList.uuid },
    });
    this.query();
  }

  query() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechat/fetchWeChatList',
    })
  }


  clearError() { this.setState({ error: ''}); }

     render() {
      const { wechat, loading } = this.props;

      const wechatList = Array.isArray(wechat.wechatList) > 0 ? wechat.wechatList : [];
      const tableColumns = getWeChatColumns(
          { wechat },
          {
            onDeleteShoes: this.onDeleteShoes.bind(this),
           // onEditShoesTypes: this.onEditShoesTypes.bind(this),
          }
      );

         return(
           <PageHeaderWrapper title="基本洗鞋服务">
             <Card>
               <Table
                 loading={loading}
                 columns={tableColumns}
                 rowKey={record => record.uuid}
                 dataSource={wechatList}
                 pagination={{'defaultPageSize': 10,showQuickJumper: true }}
                 size="middle"
                // bordered
                // components={this.components}
               />
             </Card>
           </PageHeaderWrapper>
           
         );
     }

}
export default WeChatList;