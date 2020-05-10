import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card,Icon , Col, Row, Form, Input, Modal, Popconfirm, Button, Upload, Select,message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { easyRouteTo } from '../../utils/easyDispatch';
import  createFormItems   from '../../utils/createFormItem';

function showImage(url) {
  Modal.info({
    title: "零食详图",
    content: <img src={url} alt={url} style={{ width: "80%" }} />,
    width: window.innerWidth * 0.4,
  });
}

const { Option } = Select;

const defaultGoBack = {
  router: '/SnacksManager/SnacksList',
  title: '零食列表',
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
@connect(({ snacks, loading }) => ({
    snacks, // 这里要改
  isSaving: loading.effects['snacks/fetchclassifyList'],// 这里要改
  loading: loading.models.snacks,
}))
@Form.create()
class AddSnacks extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      selectvalue: undefined,
    }
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'snacks/fetchclassifyList',
    });
  }


  onSubmit() {
    const antdForm = this.props.form;
    const { dispatch } = this.props;
    const { selectvalue,imageUrl } = this.state;
    antdForm.validateFields((error, values) => {
      if (error) return;
      this.setState({ error: ' '});
      const sendValues = Object.assign({}, values);
      sendValues.classify_uuid = selectvalue;
      sendValues.images = imageUrl;
     
      dispatch({
        type: 'snacks/fetchSnackAdd',
        payload: { ...sendValues },
      });
      easyRouteTo(this, defaultGoBack.router);
    })
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

  SelectChange = (value) => {
    
    this.setState({
      selectvalue: value
    })
  }

  render() {
    const { isSaving, snacks } = this.props;
    const { error, loading, imageUrl } = this.state;
    const classifylist = Array.isArray(snacks.classifylist) ? snacks.classifylist : [];
   

    const content = (
      <div>
        <Button 
          icon="left" 
          type="primary"
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
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" style={{ marginTop: 8,color: '#666' }}>上传图片</div>
      </div>
    );

 
    return (
      <PageHeaderWrapper title="" content={content} loading={isSaving} extraContent={extraContent}>
        <Card bordered={false} title={<span><Icon type="form" />&nbsp;上架零食</span>} style={{ marginBottom: 30 }}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食名称">
                {form.input({
                  name: 'name',rules: [
                    newRequiredRule('零食名称不为空'),
                    newMaxLenRule(255, `零食名称`),
                    { pattern: /\+=\x/g, message: '禁止输入+x=字符'}
                  ]
                })}
              </Form.Item>
            </Col>
            {/* <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食价格">
                {form.input({
                  name: 'money',rules: [
                    newRequiredRule('零食价格不为空'),
                  ]
                })}
              </Form.Item>
            </Col> */}
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="零食价格">
                {getFieldDecorator('money', {
                    rules: [
                      newRequiredRule(`零食价格不允许为空`),
                    ],
                  })(
                    <Input placeholder="请输入你的内容" size="large" type="number" />
                  )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="分配零食种类">
                {getFieldDecorator('classify_uuid', {
                  rules: [
                    // { required: true, message: '请选择提醒类型' }
                  ]
                })(
                  <div>
                    <Select placeholder="请选择" style={{ width: 200,marginRight: 50 }} onChange={this.SelectChange}>
                      {classifylist.map( it => <Option value={it.uuid} key={it.uuid+it.time}>{it.name}</Option>)}
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <span>零食图片：</span>
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                style={{ width: 128, height: 128, marginTop: 10 }}
              >
                {imageUrl ? <img src={imageUrl} alt='logo' onClick={showImage.bind(this, imageUrl)} style={{ width: 200, height: 200, marginTop: 10 }} /> : uploadButton}
              </Upload>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }

}
export default AddSnacks;



