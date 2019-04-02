import config from '../config';
import Taro from '@tarojs/taro';
import Log from './log';
import * as router from '../mock-data/config'
import login from 'src/pages/login';

const SERVER_API_ROUTE_MAP = router.routes;

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
  } else {
      document.addEventListener(
          'WebViewJavascriptBridgeReady'
          , function() {
              callback(WebViewJavascriptBridge)
          },
          false
      );
  }
}

export class AjaxProvider {
  DOMAIN = config.serverDomain;
  APPID = config.miniAppId;
  public static bridge = null;
  public static bridgeTask = null;

  static isApp () {
    return window.navigator.userAgent.indexOf('IOV_IOS_') !== -1 || window.navigator.userAgent.indexOf('IOV_Andraid_') !== -1;
  }

  static init () {
    if (process.env.TARO_ENV === 'h5') {
      // Log.info(window.navigator.userAgent)
      if(window.navigator.userAgent.indexOf('IOV_IOS_') !== -1) {

        setupWebViewJavascriptBridge((bridge) => {
          // Log.info('IOS brige init complete');
          AjaxProvider.bridge = bridge;
        });
      } else if(window.navigator.userAgent.indexOf('IOV_Andraid_') !== -1) {
        // Log.info('安卓环境');

        connectWebViewJavascriptBridge((bridge) => {
          // Log.info('安卓 brige init complete');
          AjaxProvider.bridge = bridge;
        })
      }
    }
  }

  getApiInfo (_action: string = '') {
    let temp = SERVER_API_ROUTE_MAP[_action];
    let url = temp.url;
    return {
      url: this.DOMAIN + url,
      method: temp.method,
      isArray: temp.isArray
    };
  }

  callbackFn (response, _action) {
    // Log.info('99999')
    // Log.info('typeof response111::',typeof response)
    // Log.info('response111::',response)
    // if (window.navigator.userAgent.indexOf('IOV_Andraid_') !== -1) {
    //   response = JSON.parse(response);
    // }
    // Log.info('typeof response222::',typeof response)
    // Log.info('response222:',response)
    // Log.info('response.statusCode222::'+response.statusCode);

    if (response.data) {
      if (response.data.code) {
        response.data.success = response.data.code === 200;
      }
    }
    if (!AjaxProvider.bridge) {
      let cookie = response.header['Set-Cookie'];
      if (cookie) {
        let newCookies: string[] = [];
        let newCookieMap: {
          [x: string]: any
        } = Taro.getStorageSync('cookieMap') || {};
        cookie.split(';').forEach((item:string) => {
          if (item.indexOf('=') > -1) {
            item = item.replace('Path=/,', '').trim();
            item = item.replace('path=/,', '').trim();
            item = item.replace('HttpOnly,', '').trim();
            let k = item.split('=')[0];
            if (k !== 'Path' && k !== 'Max-Age' && k !== 'Expires') {
              newCookieMap[item.split('=')[0]] = item;
            }
          }
        });
        Taro.setStorageSync('cookieMap', newCookieMap);
        Object.keys(newCookieMap).forEach(key => {
          newCookies.push(newCookieMap[key]);
        });
        Taro.setStorageSync('cookie', newCookies.join(';'));
      }
    }

    if (response.statusCode !== 200) {
      if (response.statusCode === 401) {
        response.data = {
          code: 0,
          msg: response.data && response.data.info ? response.data.info : '重新登录'
        };
        // Log.info('_action::'+_action);
        if (!AjaxProvider.bridge) {
          if (_action !== 'getCurrentUser') {
            Taro.reLaunch({
              url: '/pages/welcome'
            });
          }
        }
        return response.data;
      } else {
        response.data = {
          code: 0,
          msg: response.data
        };
      }
    } else if (response.data.success === false) {
      response.data.code = 0;
      response.data.msg = response.data.info;
    } else {
      response.data.code = 200;
    }
    // Log.info('response.data::'+ JSON.stringify(response.data));
    return response.data;
  }

  failCallbackFn (error, routeConfig) {
    error.errMsg = error.errMsg || error.message;
    if (error.errMsg.indexOf('timeout') > -1) {
      // toast.error('请求超时');
    }
    if (error.errMsg === 'request:fail 未能找到使用指定主机名的服务器。' || error.errMsg === 'request:fail Unable to resolve host"wx.itink.com.cn":No address associated') {
      setTimeout(() => {
        // toast.error('域名解析错误');
      },1000)
    }
    if (routeConfig.isArray) {
      return { total: 0, list: [], code: 0, msg: error && error.errMsg ? error.errMsg : 'has error' };
    }
    return { data: null, msg: error && error.errMsg ? error.errMsg : 'has error', code: 0 };
  }

  request (_action: string = '', _params: {} = {}) {
    let routeConfig = this.getApiInfo(_action);
    if (!routeConfig) throw new Error('SERVER_API_ROUTE_MAP no action: ' + _action);

    _params = Object.assign(_action === 'registUserByWeiXinUserInfo' ? {
    } : {
      // maCode: wepy.getStorageSync('jsCode'),
      state: this.APPID
    }, _params || {});

    Object.keys(_params).forEach(k => {
      if (_params[k] == null) delete _params[k];
    });

    if (AjaxProvider.isApp() && process.env.TARO_ENV === 'h5') {
      let method = routeConfig.method.toLowerCase() === 'get' ? 'HttpGet' : 'HttpPost';
      // Log.info('安卓开始请求接口')
      let time = 0, task, fn = setTimeout;
      if (!AjaxProvider.bridge) {
        time = 300;
        fn = setInterval;
      }

      return new Promise(resolve => {
        let that = this;
        task = fn(() => {
          if (!AjaxProvider.bridge) return;
          clearInterval(task);
          clearTimeout(task);
          // Log.info('3333333')
          // try{
            AjaxProvider.bridge.callHandler(
              method,
              {'url': routeConfig.url, 'param': _params},
              function(responseData) {
                // try {
                  let data = null;
                  // Log.info('typeof responseData::'+ typeof responseData)
                  // Log.info('请求完成，responseData')
                  // Log.info(responseData)
                  if (window.navigator.userAgent.indexOf('IOV_Andraid_') !== -1) {
                    data = JSON.parse(responseData);
                  } else {
                    data = responseData;
                  }
                  // Log.info('typeof data::'+ typeof data)
                  // Log.info('data::'+data)
                  // Log.info('data.statusCode111::',data.statusCode)
                  if (data.statusCode === '404' || data.statusCode === '500') {
                    resolve(that.failCallbackFn(data, routeConfig));
                  } else {
                    // Log.info('app.request')
                    resolve(that.callbackFn(data, _action));
                  }
                // } catch (error) {
                //   Log.info('error.message222::', error.message)
                // }
              }
            );
          // }catch (error) {
          //   Log.info('error.message111',error.message)
          // }
        }, time);
      });
    } else {
      let header = {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        cookie: Taro.getStorageSync('cookie')
      };
      return Taro.request({
        url: routeConfig.url, // 仅为示例，并非真实的接口地址
        data: _params,
        method: routeConfig.method,
        header: header
      }).then((response) => {
        // Log.info('taro.request')
        return this.callbackFn(response, _action);
      });
    }

  }
}

export default new AjaxProvider();
