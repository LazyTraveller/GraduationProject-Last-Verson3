import _ from 'lodash';
import { connect } from 'dva';
import React, { Fragment } from 'react';
import { Row ,Col, Form, Input,Select, Upload,message, Icon} from 'antd';
import FormSubmitModal from '../../../components/FormSubmitModal';

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

@connect(({ shoes }) => ({
    shoes,
  }))

   class EditModal extends React.Component {
       constructor(props) {
           super(props);
           this.state = {
               error: '',
               loading: false,
           }
       }

    onSubmit(uuid,values) {
        const { dispatch } = this.props;


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
        const { error, loading,imageUrl } = this.state;
        
        const uploadButton = (
            <div>
              <Icon type={ loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text" style={{ marginTop: 8,color: '#666' }}>上传图片</div>
            </div>
          );
           return (
             <FormSubmitModal 
               title="编辑鞋子类型"
               onOk={this.onSubmit.bind(this)}
               formProvider={form => (
                 <Fragment>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <Form.Item>
                         {form.getFieldDecorator('textarea', {
                            // initialValue: initialValues.expireDate,
                            rules: [
                                newRequiredRule(`鞋子名称不允许为空`),
                            ]
                        })(
                          <Input placeholder="请输入鞋子名称" />
                          )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <Form.Item>
                         {form.getFieldDecorator('money', {
                             rules: [
                                 newRequiredRule(`费用定价不允许为空`),
                             ]
                         })(
                           <Input placeholder="请输入鞋子定价" />
                         )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <Form.Item>
                         {form.getFieldDecorator('types', {
                             rules: [{
                                 initialValue: '正面皮鞋',
                             }]
                         })(
                           <Select placeholder="请选择" style={{ width: 100 }}>
                             <Select.Option value="正面皮鞋" key=' Front'>正面皮鞋</Select.Option>
                             <Select.Option value="纺织面鞋" key='Textile'>纺织面鞋</Select.Option>
                             <Select.Option value="漆面皮鞋" key='Lacquer'>漆面皮鞋</Select.Option>
                             <Select.Option value="反面皮鞋" key='Reverse'>反面皮鞋</Select.Option>
                             <Select.Option value="马丁靴子" key="mating">马丁靴子</Select.Option>
                             <Select.Option value="皮包" key='Bag'>皮包</Select.Option>
                             <Select.Option value="其他" key='other'>其他</Select.Option>
                           </Select> 
                         )}
                       </Form.Item>
                     </Col>
                   </Row>
                   <Row gutter={8}>
                     <Col sm={24}>
                       <span>鞋子图片：</span>
                       <Upload
                         listType="picture-card"
                         showUploadList={false}
                         beforeUpload={beforeUpload}
                         onChange={this.handleChange}
                       >
                         {imageUrl ? <img src={imageUrl} alt='logo' style={{ width: 100, height: 100, marginTop: 10 }} /> : uploadButton}
                       </Upload>
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