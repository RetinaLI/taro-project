import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { asyncProfileInfo } from '../store/actions/profile'

import './welcome.scss'
import logo from '../assets/icons/welcome-logo@2x.png'
import profileService from '../services/profile';
import passportService from '../services/passport';
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
type PageOwnProps = {
  profile: any,
  platform: any
}

type PageState = {
}

type PageDispatchProps = {
  asyncProfileInfo: () => any
}

type IProps = PageOwnProps & PageState & PageDispatchProps;

interface Welcome {
  props: IProps;
}
@connect(({ profile }) => ({
  profile: profile.profile,
  platform: profile.platform
}), (dispatch) => ({
  asyncProfileInfo () {
    return dispatch(asyncProfileInfo())
  }
}))
class Welcome extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: ''
  }
  currentUser = null;

  state = {
    showWXLoginButton: false
  }

  componentWillReceiveProps (nextProps) {
    this.currentUser = nextProps.profile;
  }

  componentWillMount () {
    this.setState({
      showWXLoginButton: false
    });
  }

  componentWillUnmount () { }

  async componentDidShow () {
    Taro.showLoading({ title: '加载中' });
    await this.props.asyncProfileInfo();
    this.checkLogin();
    Taro.hideLoading();
  }

  componentDidHide () {

  }

  onGetWXUserInfo = async (e: {
    detail: {
      errMsg: string,
      signature: string,
      encryptedData: string,
      iv: string,
      rawData: string,
      userInfo: {
        avatarUrl: string,
        city: string,
        country: string,
        gender: number,
        language: string,
        nickName: string,
        province: string
      }
    }
  }) => {
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
      return;
    }
    let wxUserInfo = e.detail;
    if (wxUserInfo.userInfo) {
      let registerResult = await passportService.registUserByWeiXinUserInfo({
        jsCode: Taro.getStorageSync('jsCode'),
        signature: wxUserInfo.signature,
        encryptedData: wxUserInfo.encryptedData,
        iv: wxUserInfo.iv,
        accountId: 2,
        rawData: wxUserInfo.rawData
      });
      if (registerResult.code !== 200) {
        // toast.error(registerResult.msg);
      } else {
        Taro.setStorageSync('currentUser', wxUserInfo);
        await this.props.asyncProfileInfo();
        this.checkLogin();
      }
    }
  }
  async redirect() {
    // if (process.env.TARO_ENV === 'h5') {
    //   Taro.redirectTo({
    //     url: '/pages/index'
    //   });
    //   return;
    // } else {
    //   Taro.switchTab({
    //     url: '/pages/index'
    //   });
    //   return;
    // }
    let result = await profileService.getPlatforms();
    if (result.list.length === 1) {
      Taro.switchTab({
        url: '/pages/index'
      });
    } else {
      Taro.redirectTo({
        url: '/pages/profile/platform-manager'
      });
    }
  }

  async checkLogin() {
    if (process.env.TARO_ENV === 'h5') {
      this.redirect();
    } else {
      if (this.props.profile) {
        this.redirect();
        return;
      }

      try {
        let r = await Taro.checkSession();
        console.info(r);
      } catch (ex) {

      }

      let loginResult = await Taro.login();
      if (!loginResult.code) {
        // toast.error(loginResult.errMsg);
      } else {
        Taro.setStorageSync('jsCode', loginResult.code);
      }

    }



    if (Taro.getStorageSync('currentUser')) {
      // toast.info('登录超时，请重新授权登录');
      Taro.removeStorageSync('currentUser');
    }
    this.setState({
      showWXLoginButton: true
    });
  }

  render () {
    let loginView;

    if (this.state.showWXLoginButton) {
      loginView = <View className="weixin-login">
        <View className="split-line"></View>
        <View className="weixin-info">
          <p>程序由iTink开发，请确认授权以下信息</p>
          <ul>
            <li>
              <i></i>
              <Text>获得你的公开信息（昵称、头像等）</Text>
            </li>
          </ul>
        </View>
        <Button className="btn-blue" openType="getUserInfo" lang="zh_CN" onGetUserInfo={ this.onGetWXUserInfo }>授权登录</Button>
      </View>
    }

    return (
      <View className="container">
        <View className="logo">
          <Image mode="aspectFit" src={logo} />
          <Text>智科车联网平台</Text>
        </View>
        {loginView}
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Welcome as ComponentClass<PageOwnProps, PageState>
