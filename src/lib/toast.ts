
import Taro from '@tarojs/taro'

const TOAST_DURATION_TIME = 2000;

class Toast {
  showByResult(result = { code: 200, msg: '' }) {
    result.code = result.code == null ? 200 : result.code;
    result.msg = result.msg ? result.msg : result.code === 200 ? '成功' : '失败';
    if (result.code === 200) {
      this.success(result.msg);
    } else {
      this.error(result.msg);
    }
  }
  success(_text) {
    Taro.showToast({
      title: _text,
      icon: 'success',
      duration: TOAST_DURATION_TIME
    });
  }
  error(_text) {
    Taro.showToast({
      title: _text,
      icon: 'none',
      duration: TOAST_DURATION_TIME
    });
  }
  warn(_text) {
    Taro.showToast({
      title: _text,
      icon: 'none',
      duration: TOAST_DURATION_TIME
    });
  }
  info(_text) {
    Taro.showToast({
      title: _text,
      icon: 'none',
      duration: TOAST_DURATION_TIME
    });
  }
}

export default new Toast();
