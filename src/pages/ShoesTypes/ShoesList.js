import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Table, Card, Input, Row, Col, Button, message} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import getShoesColumns from './ShoesTable';
import { easyDispatch ,easyRouteTo} from '../../utils/easyDispatch';

@connect(({ shoes,loading }) => ({
    shoes,
    loadingList: loading.effects['shoes/fetchShoesTypes'],
}))

class ShoesList extends Component {
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
        type: 'shoes/fetchdeleteShoes',
        payload: { uuid: shoesList.uuid },
      });
      this.query();
    }

  

    onEditShoesTypes(shoesList) {
      const { dispatch } = this.props;
      dispatch({
        type: 'shoes/fetchUpdateShoes',
        
      })


    }

    query() {
      const { dispatch } = this.props;
      dispatch({
        type: 'shoes/fetchShoesTypes',
      })
    }
  

    clearError() { this.setState({ error: ''}); }

  


    render() {

        const { shoes, loading } = this.props;

        const shoesList = Array.isArray(shoes.shoesList) > 0 ? shoes.shoesList : [];
        const tableColumns = getShoesColumns(
            { shoes },
            {
              onDeleteShoes: this.onDeleteShoes.bind(this),
              onEditShoesTypes: this.onEditShoesTypes.bind(this),
            }
        );
        return(
          <PageHeaderWrapper title="鞋子护理服列表">
            <Card>
              <Table
                loading={loading}
                columns={tableColumns}
                rowKey={record => record.uuid}
                dataSource={shoesList}
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

export default ShoesList;
