import React ,{ Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Row, Col, Card, Form, Icon,Button, message,  Select,  Upload, Input } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { easyDispatch,easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';

const defaultGoBack = {
    router: '/shoestypes/shoeslist',
    title: '鞋子护理服务列表',
}

function newRequiredRule(msg) {
    return { required: true, message: msg };
  }

  function newMaxLenRule(len, name) {
    return { max: len, message: `${name} 不允许超过 ${len} 个字!` };
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

@connect(({ shoes, loading }) => ({
  shoes,
    isSaving: loading.effects['shoes/fetchCreateOrUpdateShoes'],
    loading: loading.models.shoes,
}))
@Form.create()
class AddOrEditShoes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading: false,
        }
    }

    



    // 编辑鞋子
    componentDidMount() {
      const shoesuuid = this.getEditShoesuuid();
      const { dispatch } = this.props;
      if (shoesuuid) { 
        dispatch({
          type: 'shoes/fetchUpdateShoes',
          payload: {uuid: shoesuuid}
        })
      }
    }

    



    // 添加鞋子
    onSubmit() {
        const antdForm = this.props.form;
        antdForm.validateFields((error, values) => {
            if (error) return;
            this.setState({ error: '' });
            let editId = this.getEditShoesuuid();
            let isEdit = true;
            if (isNaN(editId) || editId <= 0) { editId = -1; isEdit = false; }

            const sendValues = Object.assign({uuid: editId || ''}, values );
            sendValues.images = this.state.imageUrl;
            const { dispatch } = this.props;
            // console.warn("sendValues",sendValues)
            dispatch({
                type: 'shoes/fetchCreateOrUpdateShoes',
                payload: { ...sendValues }
            });
            message.success(`添加成功！`);
            easyRouteTo(this,defaultGoBack.router);
        }); 
    }

    getEditShoesuuid() { return parseInt(_.get(this, 'props.match.params.uuid', ''), 10); }


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
        const { order, isSaving } = this.props;
        const { error ,loading, imageUrl } = this.state;
        const shoeeuuid = this.getEditShoesuuid();
        

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
            onClick={ev => { ev.preventDefault(); this.onSubmit(); }}
          >
                确认添加
          </Button>
        );
        /** @type {AntdForm} */
        const antdForm = this.props.form;
        const { getFieldDecorator } = antdForm;

        const form = createFormItems(antdForm);
        const uploadButton = (
          <div>
            <Icon type={ loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text" style={{ marginTop: 8,color: '#666' }}>上传图片</div>
          </div>
        );

        return (
          <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={extraContent}>
            <Card title={<span><Icon type="file" />&nbsp;洗鞋护理服务</span>} style={{ marginBottom: 30}}>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="服务类型">
                    {form.input({
                        name: 'types', rules: [
                            // newRequiredRule(`服务类型不允许为空`),
                        ]
                    })}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="选择程度(可为空/轻/中/重)">
                    {form.input({
                        name: 'textarea', rules: [
                            // newRequiredRule(`鞋子名称不允许为空`),
                            newMaxLenRule(255,`鞋子名称`),
                        ],
                    })}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="服务定格">
                    {form.input({
                        name: 'money', rules: [
                            // newRequiredRule(`费用定价不允许为空`),
                        ]
                    })}
                  </Form.Item>
                </Col>
                
                <Col lg={6} md={12} sm={24}>
                  <span>参考图片：</span>
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
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default AddOrEditShoes;




