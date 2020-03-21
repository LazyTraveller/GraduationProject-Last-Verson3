
import _ from 'lodash';
import React from 'react';
import { Input, Select } from 'antd';


/** @type {any} */
const DEFAULT_ATTR = {};
/** @type {{[value: string]: string}} */
const DEFAULT_OPTIONS = {};
/** @type {AntdFormValidationRule[]} */
const DEFAULT_RULES = null;
// 2018-10-14 liuyue patch: add DEFAULT_OPTION_RENDER
const DEFAULT_OPTION_RENDER = (key, value) => value;

/**
 * 快速创建表单元素的模块
 *
 * @param {AntdForm} antdForm
 */

export default function createFormItems(antdForm) {

  let defaultSize = 'large';
  let initialValues = {} /** @param {{[name: string]: any}} values */
  function setInitialValues(values) { initialValues = values; }
  /** @param {"large"|"default"|"small"} size */
  function setDefaultSize(size) { defaultSize = size;};

  function select({
    name = 'select',
    desc = '内容',
    options = DEFAULT_OPTIONS,
    attr = DEFAULT_ATTR,
    rules = DEFAULT_RULES,
    decoratorAttr = DEFAULT_ATTR,
    optionRender = DEFAULT_OPTION_RENDER,
  }) {
    return antdForm.getFieldDecorator(name, {
      initialValue: String(_.get(initialValues, name, '')),
      validateTrigger: 'onBlur',
      rules: rules || [{ required: true, message: `${desc}不允许为空` }],
      ...decoratorAttr,
    })(
      
      <Select placeholder={`请输入您的${desc}`} size={defaultSize} {...attr}>
        {Object.keys(options).map(it =>
          (<Select.Option value={it} key={it}>{optionRender(it, options[it])}</Select.Option>))}
      </Select>
    );
  }

  function input({
    name = 'input',
    desc = '内容',
    attr = DEFAULT_ATTR,
    rules = DEFAULT_RULES,
    decoratorAttr = DEFAULT_ATTR,
  }) {
    return antdForm.getFieldDecorator(name, {
      initialValue: _.get(initialValues, name, ''),
      validateTrigger: 'onBlur',
      rules: rules || [{ required: true, message: `${desc}不允许为空` }],
      ...decoratorAttr,
    })(
     
      <Input placeholder={`请输入您的${desc}`} size={defaultSize} {...attr} />
    );
  }

  return {
    setInitialValues, setDefaultSize,
    select, input
  };
 
}
