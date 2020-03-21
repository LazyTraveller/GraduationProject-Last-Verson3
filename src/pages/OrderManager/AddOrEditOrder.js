import React ,{ Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Icon,Button, message, Alert,Badge,Select, DatePicker, Input, Radio, Checkbox,TreeSelect, Divider, Tree} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { easyRouteTo, easyDispatch } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';


const { TreeNode } = Tree;
const { Option } = Select;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const treeData = [
  {
    title: '去氧化',
    key: '0-0',
    children: [
      { title: '轻度去氧化',key: '0-0-0', },
      { title: '中度去氧化',key: '0-0-1', },
      { title: '重度去氧化',key: '0-0-2', },
    ],
  },
  
];

const defaultGoBack = {
    router: '/order/user-order',
    title: '订单列表',
}

function newRequiredRule(msg) {
    return { required: true, message: msg };
  }

  function newMaxLenRule(len, name) {
    return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
  }


@connect(({ order, loading }) => ({
    order,
    isSaving: loading.effects['order/fetchcreateOrder'],
    loading: loading.models.order,
}))
@Form.create()
class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            valueRadio: '',
            valueCheckbox: '',
            Radiomoney: 0,
            Checkboxmoney: 0,
            count: 1,
            value: undefined,
            address: undefined,
        }
    }

    // 编辑订单
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/fetchShoesTypes',
      });
      dispatch({
        type: 'order/fetchBasicServices',
      });
      dispatch({
        type: 'order/fetchIssueList',
      });
    }



    // 添加订单
    onSubmit() {
       // const antdForm = this.props.form;
       const { value, count, Radiomoney, Checkboxmoney, valueRadio,valueCheckbox, address} = this.state;
       const { dispatch, form, order} = this.props;
       const showIssue = Array.isArray(order.showIssue) > 0 ? order.showIssue : [];
       let C = 0;
       showIssue.map(it => {
         C = _.get(it, "discount");
       });

       let CheckedValues = '';
       valueCheckbox.map(it => {
         const A = it.split("+");
         CheckedValues +=  "+" +A[1];
       });
      
       form.validateFields((error, values) => {
            if (error) return;
            this.setState({ error: '' });
            const sendValues = Object.assign({ }, values );
            console.warn('values',values)
            sendValues.take_time = values.take_time.format('YYYY-MM-DD HH:mm');
            sendValues.send_time = values.send_time.format('YYYY-MM-DD HH:mm');
            sendValues.types = valueRadio + CheckedValues;
            sendValues.address = `${address} || 详细地址： ${values.address1}`;
            sendValues.sum = count;
            // sendValues.address = value.address+" "+this.state.address;
            sendValues.money = (Radiomoney+Checkboxmoney) * count * C;
            console.warn('sendValues',sendValues)
            dispatch({
              type: 'order/fetchcreateOrder',
              payload: sendValues,
            });
           
        }); 
        message.success('下单成功');
        easyRouteTo(this,defaultGoBack.router);
    }

    getEditOrderId() { return parseInt(_.get(this, 'props.match.params.uuid', ''), 10); }

 
    // 基本洗鞋数据
    onChangeRadio = e => {
      this.setState({
        valueRadio: e.target.value,
        Radiomoney: e.target.title,
      });

    }
   

    // 护理服务数据
    onChangeCheckbox = (checkedValues)=> {
      let checkboxmoney = 0;
      checkedValues.map(it => {
        checkboxmoney += parseInt(it, 10);
      });
      this.setState({
       valueCheckbox: checkedValues,
       Checkboxmoney: checkboxmoney,
      })
    }
  
    increase = () => {
    
      
      const count = this.state.count +1;
      this.setState({ count });
    }

    decline = () => {
      let count = this.state.count -1;
      if (count < 0 ) {
        count = 0;
      }
      this.setState({count});
    }

    handleChange = (value) => {
      console.warn(`selected ${value}`);
      this.setState({
        address: value,
      })
    }

    render() {
        const { order, isSaving } = this.props;
        const shoesList = Array.isArray(order.shoesList) > 0 ? order.shoesList : [];
        const basicList = Array.isArray(order.basicList) > 0 ? order.basicList : [];
        const showIssue = Array.isArray(order.showIssue) > 0 ? order.showIssue : [];

        // console.warn("showIssue data", showIssue);
        const { error ,Checkboxmoney,Radiomoney, valueCheckbox, valueRadio, count } = this.state;
        // console.warn('Checkboxmoney',Checkboxmoney );
        // console.warn('Radiomoney',Radiomoney );
        // console.warn('valueCheckbox',valueCheckbox );
        // console.warn('valueRadio',valueRadio );
      //   console.warn(`shoesList ----`,shoesList);
      let A = "";
      let C = 0;
      showIssue.map(it => {
        A = _.get(it, "point");
        C = _.get(it, "discount");

      });
      const B = A.split("@");
      // console.warn('point',A );
      //  console.warn('discount',C );


        const content = (
          <div>
            <Button 
              icon="left" 
              onClick={ev => { ev.preventDefault(); easyRouteTo(this,defaultGoBack.router); }}
            >
              {defaultGoBack.title}
            </Button>
          </div>
        );
        const extraContent = (
          <Button 
            icon="check"
            type="primary"
            disabled={!!isSaving || !!error}
            onClick={ev => { ev.preventDefault();this.onSubmit();}}
          >
                确认保存
          </Button>
        );
        /** @type {AntdForm} */
        const antdForm = this.props.form;
        const { getFieldDecorator } = antdForm;
    
        const form = createFormItems(antdForm);
        


        return (
          <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={extraContent}>
            <Card title={<span><Icon type="file" />&nbsp;客户基础信息</span>} style={{ marginBottom: 10}}>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="客户名称">
                    {form.input({
                        name: 'username', rules: [
                            newRequiredRule(`客户名称不允许为空`),
                            newMaxLenRule(255,`用户名称`),
                        ],
                    })}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="客户电话">
                    {form.input({
                        name: 'phone', rules: [
                            newRequiredRule(`客户电话不允许为空`),
                        ]
                    })}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="取鞋时间" >
                    {getFieldDecorator('take_time', {
                    //    initialValue: initialValues.expireDate,
                       rules: [{
                        validator: (__, value, cb) => {
                        if (!moment.isMoment(value)) return cb('请选择取鞋日期');
                        if (value.diff(moment()) < 0) return cb(`${value.format('YYYY-MM-DD')} 已经过去!`);
                        cb();
                      },
                    }],
                  })(
                    <DatePicker 
                      style={{ width: '100%' }}
                      showTime={{ format:'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="请选择有效期"
                    />
                  )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="送鞋时间">
                    {getFieldDecorator('send_time', {
                    //    initialValue: initialValues.expireDate,
                       rules: [{
                        validator: (__, value, cb) => {
                        if (!moment.isMoment(value)) return cb('请选择送鞋日期');
                        if (value.diff(moment()) < 0) return cb(`${value.format('YYYY-MM-DD')} 已经过去!`);
                        cb();
                      },
                    }],
                  })(
                    <DatePicker 
                      style={{ width: '100%' }}
                      showTime={{ format:'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="请选择有效期" />
                  )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={12} md={6} lg={6}>
                  <Form.Item label="选择寄存点">
                    {getFieldDecorator('address',  {

                    })(
                      <div>
                        <Select
                          style={{ width: 200 }}
                          placeholder="请选择寄存点"
                          onChange={this.handleChange}
                        >
                          {
                            B.map( (it)=> (
                              <Option value={it} key={it}>{it}</Option>
                            ))
                          }
                        </Select>
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Form.Item label="具体住处 (如:17栋-447)">
                    {form.input({
                    name: 'address1', rules: [
                      // newRequiredRule(`详细地址不能为空`),
                      newMaxLenRule(255, `详细地址`),
                     ],
                  })}
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} lg={12}>
                  <Form.Item label="备注信息">
                    {form.input({
                        name: 'textarea',rules: [
                           // newRequiredRule(`说明信息不允许为空`),
                            newMaxLenRule(255, `说明信息`),
                        ],
                    })}
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title={<span><Icon type="picture" />&nbsp;自定义洗鞋服务</span>} bordered={false} loading={isSaving }>
              <Row gutter={16}>
                <Col sm={24} md={12} lg={12}>
                  <Form.Item label="基本洗鞋服务">
                    {getFieldDecorator('types1', {

                    })(
                      <div>
                        
                        <Row>
                          { 
                            basicList.map(item => (
                              <Col span={8} style={{ marginBottom: 50, marginRight: 50 }} key={item.uuid}>
                                {/* <img src={item.images} alt="bb" style={{ width: 100, height:100, marginRight: 200 }} /> */}
                                <RadioGroup onChange={this.onChangeRadio} value={valueRadio} key={item.uuid}>
                                  <Radio value={item.types} key={item.uuid} title={item.money}>{item.types}&nbsp;&nbsp;{item.money}{`￥`}</Radio>
                                </RadioGroup>
                              </Col>
                             ))
                           }
                        </Row>

                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              



              <Divider />
              <Row gutter={16}>
                <Col sm={24} md={24}>
                  <Form.Item label="附件鞋子护理服务">
                    {getFieldDecorator('types2', {
                      
                    })(
                      <div>
                        <Checkbox.Group onChange={this.onChangeCheckbox} value={valueCheckbox}>
                        <Row>
                          {
                            shoesList.map(item => (
                              <Col span={6} style={{ marginBottom: 50,marginRight: 50 }} key={item.uuid}>
                                {/* <img src={item.images} alt="aa" style={{ width: 100, height: 100 ,marginRight: 200}} /> */}
                                
                                <Checkbox value={item.money+"+"+item.types+" "+item.textarea} key={item.uuid} title={item.money}>{item.types}&nbsp;{item.textarea}&nbsp;{item.money}{`￥`}</Checkbox>
                                
                              </Col>
                            ))
                          }
                        </Row>
                        </Checkbox.Group>


                        <Divider />
                        <Row>
                          <Col>
                            
                          </Col>
                        </Row>
                    
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>




              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <div>
                    <span>请选择数量：</span>
                    <Badge count={count}>
                      <ButtonGroup>
                        <Button onClick={this.decline}>
                          <Icon type="minus" />
                        </Button>
                        <Button onClick={this.increase}>
                          <Icon type="plus" />
                        </Button>
                      </ButtonGroup>
                    </Badge>
                  </div>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <div>
                    <span>合计费用：</span>
                    {(count * ( Radiomoney + Checkboxmoney ) * C).toFixed(1)}&nbsp;&nbsp;&nbsp;
                    <span style={{ color: "#ea521a"}}>{C < 1 ? (<span>(活动促销打{C}折)</span>) : null}</span>
                  </div>
                </Col>
              </Row>
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default AddOrder;









