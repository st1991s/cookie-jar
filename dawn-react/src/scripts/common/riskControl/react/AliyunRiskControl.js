// import './index.less';
import React, { Component } from 'react';

import { Dialog, Button, Form, Input, Grid } from '@alife/next';
const { Row, Col } = Grid;

import AbstractAliyunRiskControl from '../AbstractAliyunRiskControl';
import { post } from '../../../utils/request';

let hooks = {
  verifyForm: {
    value: '',
    updateCountdown: () => { },
    setState: () => { }
  }
};


export default class AliyunRiskControl extends AbstractAliyunRiskControl {
  constructor(options) {
    super(options);
    this.verifyDialogInstance = null;
  }
  //Override
  showVerifyDialog(state) {
    this.state = state;
    if (this.verifyDialogInstance) {
      return;
    }
    if (!state.verifyType) {
      this.showDialogForNoVerifyMethod(state);
      return;
    }
    if (!state.hasValidVerifyMethod) {
      this.showDialogForInvalidVerifyDetail(state);
      return;
    }
    this.verifyDialogInstance = Dialog.confirm({
      title: state.title,
      needWrapper: false,
      content: <VerifyForm { ...state } />,
      onOk: () => state.onOk(hooks.verifyForm.value),
      onCancel: state.onCancel
    });
    console.log('[showVerifyDialog]');
  }

  showDialogForNoVerifyMethod(state) {
    Dialog.confirm({
      title: '设置验证方式',
      needWrapper: false,
      onOk: state.onOk,
      onCancel: state.onCancel,
      content: <div>
        <h4>系统没有检测到您的验证方式!</h4>
        为了保障您的账户安全，请先设置验证方式。
      </div>,
      locale: {
        ok: '前往设置'
      }
    });
  }
  showDialogForInvalidVerifyDetail(state) {
    Dialog.confirm({
      title: state.title,
      needWrapper: false,
      content: state.bindDescription,
      onOk: state.onOk,
      onCancel: state.onCancel
    });
  }

  //Override
  closeVerifyDialog() {
    this.verifyDialogInstance = null;
    this.clearTimer();
    console.log('[closeVerifyDialog]');
  }

  //Override
  processVerifyCodeError() {
    hooks.verifyForm.setState({ isVerifyCodeInvalid: true });
    console.log('[processVerifyCodeError] ');
  }

  //Override
  confirmFinishSetting() {
    const { url } = this.options;
    Dialog.confirm({
      title: '设置验证方式',
      content: '请在新窗口中完成验证方式的设置',
      needWrapper: false,
      locale: {
        ok: '完成设置',
        cancel: '遇到问题'
      },
      onCancel: () => {
        window.open(url.bindMobileHelp, '_blank');
      }
    });
    console.log('[confirmFinishSetting] ');
  }

  //Override
  updateCountdown(value) {
    hooks.verifyForm.updateCountdown(value);
  }

  //Override
  post(url, data) {
    console.log('[post] ', url, data);
    return post(url, data);
  }
}


class VerifyForm extends Component {
  constructor(props) {
    super(props);
    this.state = { isCountdownStarted: false, countdown: 0, isVerifyCodeInvalid: false };
    this.updateCountdown = this.updateCountdown.bind(this);
  }
  componentWillMount() {
    const { updateCountdown } = this;
    hooks.verifyForm = {
      updateCountdown,
      setState: this.setState.bind(this)
    };
  }
  componentWillUnmount() {
    hooks.verifyForm = {
      value: '',
      updateCountdown: () => { },
      setState: () => { }
    };
  }

  render() {
    const {
      url,
      verifyType,
      verifyDetail,
      onGenerateCode,
      detailDescription,
      changeDescription
    } = this.props;
    const itemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    };
    const {
      isCountdownStarted,
      countdown,
      isVerifyCodeInvalid
    } = this.state;
    console.log(isVerifyCodeInvalid);
    return <Form>
      <Form.Item label={detailDescription} { ...itemLayout }>
        <div className="next-form-text-align">
          <span>{verifyDetail}</span>
          <a href={url.changeVerificationMethod} target="_blank">{changeDescription}</a>
        </div>
      </Form.Item>
      <Form.Item label="校验码：" 
      { ...itemLayout } 
      validateStatus={isVerifyCodeInvalid ? 'error' : ''} 
      help={isVerifyCodeInvalid ? '校验码错误,请重新输入' : ''}>
        <Row>
          <Col>
            <Input onChange={this.onInputChange} style={{ width: 60 }} />
          </Col>
          {
            //sms or email时，才需要发送行为
            verifyType != 'ga' ?
              <Col>
                {
                  isCountdownStarted ?
                    <Button disabled>{`${countdown}秒后重发`}</Button> :
                    <Button onClick={(onGenerateCode)}>点击获取</Button>
                }
              </Col>
              :
              ''
          }
        </Row>
      </Form.Item>
    </Form>;
  }

  onInputChange(value) {
    hooks.verifyForm.value = value;
  }

  updateCountdown(value) {
    this.setState({
      countdown: value,
      isCountdownStarted: value != 0
    });
  }
}
