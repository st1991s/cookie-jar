import merge from 'lodash/merge';
const defaultOptions = {
  dialogCssPrefix: 'next-spark-fetch',

  code: {
    success: '200',
    //风控检测到风险并需要二次验证
    doubleConfirm: 'FoundRiskAndDoubleConfirm',
    //风控检测到风险需要中断业务流程
    forbidden: 'FoundRiskAndTip',
    //二次验证不通过
    verifyCodeInvalid: 'verifyCodeInvalid'
  },
  url: {
    //请求发送验证码接口地址
    generateVerificationCode: '/risk/sendVerifyMessage.json',
    //设置用户风控验证方式地址
    setVerificationMethod: 'https://account.console.aliyun.com/#/secure',
    //修改设置手机号/邮箱/MFA地址
    changeVerificationMethod: 'https://account.console.aliyun.com/#/secure',
    //如何设置手机帮助 
    bindMobileHelp: 'https://account.console.aliyun.com'
  },
  i18n: {
    'sms': {
      title: '手机验证',
      detailDescription: '您绑定的手机：',
      changeDescription: '更换手机',
      bindDescription: '未检测到手机号码,为了保障您的账户安全，请先设置手机绑定。'
    },
    'email': {
      title: '邮箱验证',
      detailDescription: '您绑定的邮箱：',
      changeDescription: '更换邮箱',
      bindDescription: '未检测到邮箱,为了保障您的账户安全，请先设置邮箱绑定。'
    },
    'ga': {
      title: 'MFA验证',
      detailDescription: '验证虚拟MFA设备：',
      changeDescription: '解除MFA绑定'
    }
  }
};

export default class AbstractAliyunRiskControl {
  constructor(options) {
    this._config(options);
    this.verifyCodeTimeout = 0;
  }
  handleResponse(response = {}, requestUrl, originData) {

    const { code, i18n, url } = this.options;
    const { data } = response;
    const { codeType, verifyType, verifyDetail } = data || {};

    return new Promise((resolve, reject) => {
      if (response.code == code.success) {
        resolve(response);
      }
      //其他错误直接走通用报错逻辑
      if (response.code != code.doubleConfirm) {
        resolve(response);
      }
      if (!response.data) {
        resolve(response);
      }
      if (response.code == code.doubleConfirm) {

        const verifyInfo = i18n[verifyType] || i18n['sms'];
        let dialogState = merge({}, verifyInfo, {
          url,
          verifyType,
          verifyDetail,
          hasValidVerifyMethod: false,
          onOk: () => { resolve(response); },
          onCancel: () => { reject('cancel'); },
          onGenerateCode: () => { }
        });
        // 没有设置 verifyType
        // 或者 verifyType == 'sms' or 'email' 且 没有设置 verifyDetail(手机号码或邮箱)
        if (!verifyType ||
          ((verifyType == 'sms' || verifyType == 'email') && !verifyDetail)) {
          dialogState.onOk = () => {
            this.navtoVerifyMethodSetting();
            this.confirmFinishSetting();
            reject('SettingVerifyMethod');
          };
        } else {
          //TODO: handle
          let sendCodeRequestId;
          dialogState.hasValidVerifyMethod = true;
          dialogState.onGenerateCode = async () => {
            try {
              const sendCodeResponse = await this.post(url.generateVerificationCode, { codeType, verifyType });
              sendCodeRequestId = sendCodeResponse.requestId;
              this.resetCountDown();
              this.runTimer();
              return sendCodeResponse;
            } catch (e) {
              console.log('=====', e);
              this.verifyCodeTimeout = 0;
            }
            return null;
          };
          dialogState.onOk = async (verifyCode) => {
            const newData = merge({}, originData, {
              codeType,
              verifyCode,
              verifyType,
              requestId: sendCodeRequestId
            });
            try {
              const response = await this.post(requestUrl, newData);
              if (response && response.code == code.verifyCodeInvalid) {
                this.processVerifyCodeError();
                //建议暂时不关闭弹框
                return false;
              } else {
                this.closeVerifyDialog();
                resolve(response);
                return true;
              }
            } catch (e) {
              reject(e);
              return true;
            }
          };
        }
        this.showVerifyDialog(dialogState);
      }

    });

  }

  resetCountDown() {
    this.verifyCodeTimeout = 60;
  }

  runTimer() {
    this.updateCountdown(this.verifyCodeTimeout--);
    this.timer = setInterval(() => {
      this.updateCountdown(this.verifyCodeTimeout--);
      if (this.verifyCodeTimeout < 0) {
        this.verifyCodeTimeout = 0;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  clearTimer() {
    clearInterval(this.timer);
  }

  /**
   * @param {state}
   * state: {
   *   verifyType,
   *   verifyDetail,
   *   onGenerateCode(Function,)
   * } 
   * 
   * verifyType == null 时
   *    弹框提示 Title： 设置验证方式， Message：[警告] 系统没有检测到您的验证方式! 为了保障您的账户安全，请先设置验证方式。
   * verifyType == 'sms' 或 'email' 时
   *    如果 verifyDetail == null
   *      弹框提示 Title 设置手机 or 设置邮箱，校验码：【】【点击获取】disable掉
   *    如果 verifyDetail == '137****5310' or 'li**@aliyun.com'
   *      弹框提示 Title 手机验证 or 邮箱验证，校验码：【】【点击获取】
   *        【点击获取】后，倒计时，输入验证码，弹框可以提交
   *      
   * verifyType == 'ga'
   *    弹框提示：MFA验证，验证码：【】
   *    输入后提交
   * @return {void}
   */
  showVerifyDialog(state) {
    this.state = state;
    // console.log('[showVerifyDialog]')
  }

  //关闭弹框的逻辑
  closeVerifyDialog() {
    // console.log('[closeVerifyDialog]')
  }

  //输入验证码错误时的处理
  processVerifyCodeError() {
    // console.log('[processVerifyCodeError] ')
  }

  //引导去设置验证方式的逻辑   
  navtoVerifyMethodSetting() {
    const { url } = this.options;
    window.open(url.bindMobileHelp, '_blank');
  }
  //确认完成验证方式的设定
  confirmFinishSetting() {
    // console.log('[confirmFinishSetting] ')
  }

  // 倒计时更新
  updateCountdown(value) {
    console.log('[updateCountDown] ', value);
  }

  post(url, data) {
    console.log('[post] ', url, data);
    return new Promise((resolve) => {
      resolve({ code: 'Other Error', message: 'Some Message', requestId: 'requestId' });
    });
  }

  _config(options) {
    this.options = merge({}, defaultOptions, options);
  }
}