//@ts-check
/// <reference path="../../../types.d.ts" />

/*
  图片上传组件
*/

import React, { Fragment } from 'react';
import { Button, Icon, Spin, message, Modal } from 'antd';
import styles from './index.less';


const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

/**
 * @augments {React.PureComponent<{
    accept: string;
    files: ({title: string; name: string; defaultPreviewURL?: string; })[];
    onUpload: (form: FormData, callback: Function) => any;
    fileMaxSize: number;
  }, {}>}
 */
export default class IDPicturesUploader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.files = this.props.files.map(it => ({
      element: null,
      preview: null,
    }));

    this.state = {
      /** @type {("wait"|"preview"|"uploading"|"uploaded")[]} */
      status: this.props.files.map(it => it.defaultPreviewURL ? 'preview' : 'wait'),
      error: '',
      modalVisible: false,
      modalTitle: '',
      modalImgSource: null,
    };
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  onClickUpload() {
    const { files, onUpload, fileMaxSize } = this.props;
    const fileMaxSizeText = `${(fileMaxSize / 1024 / 1024).toFixed(2)} M`;
    const form = new FormData();

    let i = 0;
    for (const { element } of this.files) {
      const { title, name } = files[i];
      if (!element) return message.error(`IDPicturesUploader#this.files[${i}] 是空的!`);
      if (!element.files || element.files.length === 0) return alert(`请先选择 ${title} !`); //eslint-disable-line

      const file = element.files[0];
      if (file.size > fileMaxSize)
        return this.setState({ error: `${title} 的尺寸过大 (最大尺寸: ${fileMaxSizeText})` });

      form.append(name, file);
      i++;
    }
    this.setState({ status: this.files.map(it => 'uploading'), error: '' });

    const formKeys = Array.from(form.keys());
    devEcho(formKeys);

    if (onUpload) onUpload(form, callback.bind(this));

    function callback(error) {
      this.setState({ status: this.files.map(it => (error ? 'preview' : 'uploaded')), error });
    }
  }

  onClickSelect(index) {
    const el = this.files[index].element;
    if (el) el.click();
  }

  onClickDelete(index) {
    const el = this.files[index].element;
    if (el) {
      el.value = '';
    }

    this.setFileStatus(index, 'wait');
  }

  onChange(index) {
    const el = this.files[index].element;
    if (!el) return;

    const { files } = el;
    if (!files || files.length !== 1) return;

    if (files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        //@ts-ignore
        this.files[index].preview = e.target.result;
        this.setFileStatus(index, 'preview');
      };
      reader.readAsDataURL(files[0]);
    }
    devEcho(files[0]);
  }

  setFileStatus(index, status) {
    const dupStatus = [...this.state.status];
    dupStatus[index] = status;
    this.setState({ status: dupStatus });
  }

  bindInputElement(index, element) {
    this.files[index].element = element;
  }

  renderWaiting(file, index) {
    return (
      <div className={styles.idUploadButton} onClick={this.onClickSelect.bind(this, index)}>
        <Icon type="upload" />
        <br />
        {`上传 ${file.title}`}
      </div>
    );
  }

  /**
   * @param {{title: string; name: string; defaultPreviewURL?: string;}} file
   * @param {number} index
   */
  renderUploadingOrPreview(file, index) {
    const st = this.state.status[index];
    // preview or uploading
    return (
      <Spin spinning={st === 'uploading'}>
        <div className={styles.idUploadPreview} onClick={() => {
          const modalTitle = `预览 ${file.title}`;
          if (this.files[index].preview)
            return this.setState({ modalTitle, modalVisible: true, modalImgSource: index });
          if (file.defaultPreviewURL)
            return this.setState({ modalTitle, modalVisible: true, modalImgSource: file.defaultPreviewURL });
        }}>
          <img alt={file.title} src={this.files[index].preview || file.defaultPreviewURL || EMPTY_IMAGE} />
        </div>
        {st === 'preview' ? (
          <div>
            <a onClick={this.onClickSelect.bind(this, index)}>
              <Icon type="edit" /> 修改
            </a>
            <a className={styles.idUploadDel} onClick={this.onClickDelete.bind(this, index)}>
              <Icon type="delete" /> 删除
            </a>
            <span className={styles.idUploadSmall}>{file.title}</span>
          </div>
        ) : null}
      </Spin>
    );
  }

  renderUploadButton(couldUpload, isUploading) {
    return (
      <Button
        type="primary"
        disabled={!couldUpload}
        loading={isUploading}
        style={{ marginTop: 10 }}
        onClick={this.onClickUpload.bind(this)} >
        <Icon type="upload" />
        上传
      </Button>
    );
  }

  render() {
    const { files, accept } = this.props;
    const { status, error, modalTitle, modalVisible, modalImgSource } = this.state;

    const couldUpload = status.reduce((a, b) => a && b !== 'wait', true);
    const isUploading = status.reduce((a, b) => a || b === 'uploading', false);
    const isUploaded = status.reduce((a, b) => a || b === 'uploaded', false);

    const uploaders = files.map((file, index) => {
      const st = status[index];
      return (
        <div key={file.name} className={styles.idUploadBox}>
          {st === 'wait' ? this.renderWaiting(file, index) : this.renderUploadingOrPreview(file, index)}
          <input
            type="file"
            ref={this.bindInputElement.bind(this, index)}
            style={{ display: 'none' }}
            accept={accept}
            onChange={this.onChange.bind(this, index)}
          />
        </div>
      );
    });

    return (
      <Fragment>
        <div className={styles.idUploadWrapper}>{uploaders}</div>
        {isUploaded ? (
          <span style={{ color: color.success }}> 上传成功! </span>
        ) : this.renderUploadButton(couldUpload, isUploading)}
        {error ? <span style={{ color: color.error }}> 上传失败: {error} </span> : null}

        <Modal title={modalTitle} visible={modalVisible}
          onOk={this.hideModal.bind(this)} width={800}
          cancelButtonProps={{ style: {display: 'none'}}}
          onCancel={this.hideModal.bind(this)} >
          {modalVisible ? (
            <img style={{maxWidth: '100%'}} src={(typeof modalImgSource === 'string'
              ? modalImgSource
              : this.files[modalImgSource].preview)} alt={modalTitle} />
          ) : null}
        </Modal>
      </Fragment>
    );
  }
}
