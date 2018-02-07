/**
 * Toast 
 * 全局通用的信息提示
 * 参考文档地址：http://fusion-demo.alibaba-inc.com/components?type=next&themeId=next&name=feedback
 */
import { Feedback } from '@alife/next';
const _Toast = Feedback.toast;

export default class Toast {
  static success(content) {
    _Toast.show({ type: 'success', content });
  }
  static error(content) {
    _Toast.error({ type: 'error', content });
  }
  static warn(content) {
    _Toast.warn({ type: 'prompt', content });
  }
  static show(props) {
    _Toast.show({
      type: 'success', // 组建的类型
      align: 'tc tc', // 对齐方式
      offset: [0, 60], // 对齐之后的偏移样式
      duration: 1500, // 显示持续时间
      ...props
    });
  }
}