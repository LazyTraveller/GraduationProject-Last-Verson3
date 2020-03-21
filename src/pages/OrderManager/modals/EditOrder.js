import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input,Select, Upload,message, Icon,DatePicker,Badge,Button,Radio} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;

function newRequiredRule(msg) {
    return { required: true, message: msg };
  }

  function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('you can only upload JPG file');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if ( !isLt2M) {
      message.error('image must samller than 2MB');
    }
    return isJPG && isLt2M
  
  }
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

@connect(({ order }) => ({
    order,
  }))
  @Form.create()
class EditModal extends React.Component {
       constructor(props) {
           super(props);
           this.state = {
               error: '',
               loading: false,
           }
       }

    onSubmit(values, callback) {
        const { onOk } = this.props;
        onOk(Object.assign({}, values), callback);
        
    }

    handleChange = info => {
        if(info.file.status === "uploading ") {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, imageUrl => 
            this.setState({
              imageUrl,
              loading:false,
            }))
        }
      }

       render() {
        const { error, loading,imageUrl, } = this.state;
        const { order,onShowAsync} = this.props;
        const editingOrder = Object.assign({}, order.editingOrder);
        const uploadButton = (
            <div>
              <Icon type={ loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text" style={{ marginTop: 8,color: '#666' }}>上传图片</div>
            </div>
          );
           return (
               // 子组件
             <FormSubmitModal 
               title='编辑订单'
               onOk={this.onSubmit.bind(this)}
               onShowAsync={onShowAsync}
               formProvider={form => (
                 <Fragment>
                   <Row gutter={8}>
                     <Col md={24}>
                       <Form.Item label="UUID">
                         {form.getFieldDecorator('uuid', {
                             initialValue: editingOrder.uuid,
                            })(
                              <Input disabled />
                            )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col md={12}>
                       <Form.Item label="客户名称">
                         {form.getFieldDecorator('username', {
                            initialValue: editingOrder.username,
                            rules: [
                                newRequiredRule(`客户名称不允许为空`),
                            ]
                        })(
                          <Input placeholder="请输入客户名称" />
                          )}
                       </Form.Item>
                     </Col>
                     <Col md={12}>
                       <Form.Item label="客户电话">
                         {form.getFieldDecorator('phone', {
                             initialValue: editingOrder.phone,
                            rules: [
                                newRequiredRule(`客户电话不允许为空`)
                            ]
                            })(
                              <Input placeholder="请输入客户电话" />
                            )}
                       </Form.Item>
                     </Col>
                   </Row>
                   
                   <Row gutter={8}>
                     <Col md={12}>
                       <Form.Item label="取鞋时间">
                         {form.getFieldDecorator('take_time', {
                           
                             rules: [{
                                validator: (__, value, cb) => {
                                    if (!moment.isMoment(value)) return cb('取鞋时间不允许为空');
                                    if (value.diff(moment()) < 0) return cb(`${value.format('YYYY-MM-DD HH:mm')} 已经过去!`);
                                    cb();
                                  },
                             },
                            
                            ]
                         })(
                           <DatePicker
                             style={{ width: '100%' }}
                             showTime={{ format:'HH:mm' }}
                             format="YYYY-MM-DD HH:mm"
                             placeholder="请重新选择有效的取鞋时间"
                           />
                         )}
                       </Form.Item>
                     </Col>
                     <Col md={12}>
                       <Form.Item label="送鞋时间">
                         {form.getFieldDecorator('send_time', {
                            // initialValue: editingOrder.send_time,
                             rules: [{
                                validator: (__, value, cb) => {
                                    if (!moment.isMoment(value)) return cb('送鞋时间不允许为空');
                                    if (value.diff(moment()) < 0) return cb(`${value.format('YYYY-MM-DD')} 已经过去!`);
                                    cb();
                                  },
                             },
                            ]
                         })(
                           <DatePicker
                             style={{ width: '100%' }}
                             showTime={{ format:'HH:mm' }}
                             format="YYYY-MM-DD HH:mm"
                             placeholder="请重新选择有效的送鞋时间"
                           />
                         )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <Form.Item label="详细地址  (如：广东省/中山市/石岐区/电子科技大学中山学院北门)">
                         {form.getFieldDecorator('address', {
                             initialValue: editingOrder.address,
                             rules: [
                                 newRequiredRule(`详细地址不允许为空`)
                             ]
                          })(
                            <Input placeholder="请输入详细地址" />
                          )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col md={24}>
                       <Form.Item label="备注信息">
                         {form.getFieldDecorator('textarea', {
                             initialValue: editingOrder.textarea,
                       })(
                         <Input placeholder="请输入备注信息" />
                       )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <Form.Item label="鞋子类型">
                         {form.getFieldDecorator('types', {
                             initialValue: editingOrder.types,
                         })(
                           <Input disabled placeholder="不允许修改" /> 
                         )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col md={8}>
                       <Form.Item label="鞋子数量">
                         {form.getFieldDecorator('sum',{
                             initialValue: editingOrder.sum,

                           })(
                             <Input disabled placeholder="不允许修改" />
                           )}
                       </Form.Item>
                     </Col>
                     <Col md={8}>
                       <Form.Item label="合计费用">
                         {form.getFieldDecorator('money',{
                             initialValue: editingOrder.money,

                         })(
                           <Input disabled placeholder="不允许修改" />
                         )}
                       </Form.Item>
                     </Col>
                   </Row>
                   
                 </Fragment>
               )}
              >
               {this.props.children}
             </FormSubmitModal>
           );
       }
  }


  export default EditModal;