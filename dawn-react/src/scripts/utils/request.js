//import AliyunRiskControl from '../common/riskControl';
import { Dialog, Button } from '@alife/next';
require('es6-promise').polyfill();
import axios from 'axios';
//const fetchJsonp = require('fetch-jsonp');
const fetchJsonp = require('./jsonp');
// const REQUEST_TIMEOUT = 10000;
//const aliyunRiskControl = new AliyunRiskControl();
let message_lang = {
  zh: {
    warning: '提示',
    confirm:'确定',
    session_timeout: '您当前的会话已超时，请重新登录。',
    go_to_login: '还没有登录，请前往',
    login: '登录',
    cancel: '取消',
    ok:'好',
    try_later: '服务出错，请稍后再试'
  },
  en: {
    warning: 'prompt',
    session_timeout: 'Your current session has timed out. Please log in again.',
    go_to_login: 'Not yet logged in, please go ',
    login: 'login',
    cancel: 'cancel',
    confirm:'confirm',
    ok:'OK',
    try_later: 'Service error, please try again later'
  }
};


// ====== Request Class ======
let lang = window.CURRENT_LANG || 'zh';
let message = message_lang[lang] || {};
const defaultOptions = {
  // ignoreError: false
  withCredentials: true
};
/**
 * TODO 针对特定key增加处理函数
 * @param {string} key 针对某种key的处理函数
 * @param {Function} fn 处理函数
 * @return {void};
 */
export function addHandler(key, fn) {
  ErrorHandlers[key] = fn;
}
/**
 * Requests a URL, returning a promise.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  // setDefault
  options = {
    ...defaultOptions,
    ...options
  };
  return axios(url, options)
    .then(checkStatus)
    //.then(parseJSON)
    // .then((response) => riskControl(response, url, options))
    .then((res) => {
      return checkResponse(res, options);
    }) // 接口通信成功，处理返回值
    .catch(err => handleError(err, options)); // 发生异常，进行兜底处理
}




/**
 * 发送请求
 * @param {string} url - 请求的接口地址
 * @param {object} data - 请求参数
 * @param {object} options 传递给fetch API的参数
 * @return {promise} 返回promise
 */
export function post(url, data, options={}) {
  return axios(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: stringify({
      ...data,
      sec_token: (window.ALIYUN_CONSOLE_CONFIG || {}).SEC_TOKEN
    }),
    ...options
  })
  .then((res) => {
    let result = checkResponse(res.data, options);
    return result;
  }) // 接口通信成功，处理返回值
  .catch(err => handleError(err, options)); // 发生异常，进行兜底处理
}

/**
 * get请求
 * @param {string} url 请求的接口地址
 * @param {object} params 请求参数
 * @param {object} options 传递给fetch API的参数
 * @return {promise} 返回promise
 */
export function get(url, params = {}, options={}) {
  return axios(url, {
    params
  })
    .then(checkStatus)
    //.then(parseJSON)
    // .then((response) => riskControl(response, url, options))
    .then((res) => {
      return checkResponse(res.data, options);
    }) // 接口通信成功，处理返回值
    .catch(err => handleError(err, options)); // 发生异常，进行兜底处理


  // return request(`${url}?${stringify(data)}`, {
  //   method: 'GET',
  //   credentials: 'same-origin',
  //   ...options
  // });
}

export function jsonp(url, params = {}, options={}) {
  // setDefault
  options = {
    ...defaultOptions,
    ...options
  };

  return fetchJsonp(`${url}?${stringify(params)}`,options)
  .then((res) => {
    let result = checkResponse(res, options);
    return result;
  }) // 接口通信成功，处理返回值
  .catch(err => handleError(err, options)); // 发生异常，进行兜底处理
}


// ====== Response Class ======

class AbstractResponse {
  constructor(response, error) {
    if (response) {
      this.code = response.code;
      this.data = response.data;
    }
    this.error = error || null;
  }
}

/**
 * 错误时候的响应对象
 */
// class ErrorResponse extends AbstractResponse {
//   constructor(error) {
//     super(null, error);
//   }
// }

/**
 * 接口正常时的返回对象
 */
class SuccessResponse extends AbstractResponse {
  constructor(response) {
    super(response, null);
  }
}

// ====== Util ======

//{ a: 1, b: 2} ==> a=1&b=2
function stringify(obj = {}) {
  return Object.keys(obj)
    .filter(k => obj[k] || +obj[k] === 0)
    .map(k => {
      let value = obj[k];
      if (typeof value == 'object') {
        value = encodeURIComponent(JSON.stringify(value));
      } else {
        value = encodeURIComponent(value);
      }
      return encodeURIComponent(k) + '=' + value;
    })
    .join('&');
}

// ====== 接口返回值处理具体逻辑 ======

const SUCCESS_CODE = '200';
const ErrorHandlers = {
  'verifyCodeInvalid': () => { },
  'NoPermission.Directory': function () {
    //TODO: do nothing
  },
  'default': (response) => {

    createMessage(response.message || message.try_later);
  },
  '-99': (response) => { //eslint-disable-line
    let dialog = Dialog.alert({
      needWrapper:false,
      title: message['warning'],
      footer: <Button type="primary" onClick={() => dialog.hide()}>{message['confirm']}</Button>,
      content: <div dangerouslySetInnerHTML={{
        __html: '<span style="color:#FF8A00">' + 
        '<span class="k-iconfont  icon-jingshi " style="float:left;margin:-4px 6px 0 0"></span>'+
        message.go_to_login + '<a href="//account.aliyun.com/login/login.htm?oauth_callback='
        + encodeURIComponent(location.href) + '">'
        + message.login + '</a></span>'
      }} ></div>
    });
  }
};

/**
 * 接口返回值处理逻辑，如果未捕获到匹配的处置方案，则抛出异常
 * @param {*} response 响应
 * @param {*} options 配置可选项，如忽略错误
 * @return {response}  返回响应
 */
function checkResponse(response, options) {
  const { data } = response;
  options = options || {};

  //不一定会有
  let errorMessage = response.message;
  let { code } = response;
  if (code == SUCCESS_CODE && data) {
    return new SuccessResponse(response);
  }
  if (!options.ignoreError) {
    code = response.code || 'default';
    let errorHandler = ErrorHandlers[code];
    if (!errorHandler) {
      throw new Error(errorMessage || code);
    }
    errorHandler(response);

    return response;
    // throw new ErrorResponse(response);
  } else {
    return new SuccessResponse(response);
  }
}

// function parseJSON(response) {
//   return response.json();
// }

function checkStatus(response) { 
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function createMessage(err){
  let dialogInstance = Dialog.alert({
    needWrapper:false,
    title: message['warning'],
    content: <div dangerouslySetInnerHTML={{
      __html: '<span style="color:#FF8A00">' + 
      '<span class="k-iconfont  icon-jingshi " style="float:left;margin:-4px 6px 0 0"></span>'+
      err +
    '</span>'
    }} ></div>,
    footer: <Button type="primary" onClick={() => dialogInstance.hide()}>{message['confirm']}</Button>,
    afterClose: () => {
      dialogInstance = null;
    }
  });
}
// 兜底的错误处理
function handleError(err, options) {
  options = options || {};
  // console.log('[REQUEST_ERROR] ', err);
  if (!options.ignoreError) {
    createMessage(err);
  }
  //throw new ErrorResponse(err);
}