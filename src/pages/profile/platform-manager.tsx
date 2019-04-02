import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, Label, Input } from '@tarojs/components'


import { connect } from '@tarojs/redux'
import { asyncProfileInfo } from '../../store/actions/profile'


import toast from '../../lib/toast'

import profileService from '../../services/profile'
import passportService from '../../services/passport'

import selectIcon from '../../assets/icons/select-icon.png';
import delIcon from '../../assets/icons/delete-icon.png';

import './platform-manager.scss'
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

interface PlatformManager {
  props: IProps;
}
type IProps = PageOwnProps & PageState & PageDispatchProps;

@connect(({ profile }) => ({
  profile: profile.profile,
  platform: profile.platform
}), (dispatch) => ({
  asyncProfileInfo () {
    return dispatch(asyncProfileInfo())
  }
}))
class PlatformManager extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '平台列表',
    usingComponents: {
    }
  }

  state = {
    platforms: [],
    selectedPlatform: null,
    isShowAddPlatformDialog: false,
    newPlatformCode: '',
    newPlatformUserName: '',
    newPlatformPassword: '',
    enableValidate: false,
    formErrorMsg: ''
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  componentDidShow () {
    this.bindPlatforms();
  }

  componentDidHide () { }

  async bindPlatforms () {
    let result = await profileService.getPlatforms();

    if (result.mapList.length === 0) {
      this.showAddModal();
      return;
    }

    let selectedPlatform = result.mapList.find((platform) => {
      return this.props.profile.unionId === platform.unionId;
    });
    this.setState({
      platforms: result.mapList,
      selectedPlatform
    });
  }

  render () {
    let profile = this.props.profile;
    let selectedPlatform = this.state.selectedPlatform;
    let platformViews = this.state.platforms.map((item) => {
      return <View className="item" key={String(item.unionId)}>
              <View onClick={this.selectPlatform.bind(this, item)} className={`select-icon ${selectedPlatform && selectedPlatform.unionId == item.unionId ? 'selected' : ''} `}>
                  <Image className="img" src={selectIcon}></Image>
              </View>
              <View onClick={this.selectPlatform.bind(this, item)} className="platform-name">
                <Label className="label">{ item.productName }</Label>
                <Text className={item.unionId === profile.unionId ? 'txt checked' : 'txt'}>(当前)</Text>
                <View className="name">{ item.name }</View>
              </View>
              { item.unionId != profile.unionId && <Image onClick={this.removePlatform.bind(this, item)} className="img-del"
                src={delIcon}></Image> }
            </View>
    });

    let addPlatformView = <View className="modal" hidden="{{ !isShowAddPlatformDialog }}">
                            <View className="wrapper">
                              <View className="modal-title">绑定车联网账号
                                { this.state.platforms.length !== 0 && <View className="foton-ui close" onClick={this.hideModal}></View> }</View>
                              <Input className={ this.state.enableValidate && this.state.newPlatformUserName.length === 0 ? 'input has-error' : 'input ' } placeholder="请输入您注册的车联网账号" max-length="12" placeholder-class="input-placeholder" onInput={this.onInputUserName} value={this.state.newPlatformUserName} />
                              <Input className={ this.state.enableValidate && this.state.newPlatformPassword.length === 0 ? 'input has-error' : 'input ' } placeholder="请输入此车联网账号的密码" placeholder-class="input-placeholder" type="password" onInput={this.onInputPassword} value={this.state.newPlatformPassword} />
                              <Input className={ this.state.enableValidate && this.state.newPlatformCode.length === 0 ? 'input has-error' : 'input ' } placeholder="请输入企业代码" max-length="12" placeholder-class="input-placeholder" onInput={this.onInputCode} value={this.state.newPlatformCode} />
                              <View className="notice">*注：仅欧马可、欧曼、欧辉、奥铃、时代车联网平台帐号可添加</View>
                              { this.state.formErrorMsg && this.state.formErrorMsg.length > 0 && <Text className="error">{ this.state.formErrorMsg || '无' }</Text> }
                              <Button className="btn btn-blue" onClick={this.addPlatform}>确定</Button>
                              { this.state.platforms.length == 0 && <View className="tourist-notice" onClick={this.touristPlatform}>没有账号的用户，点此<Text className="t">游客访问</Text></View> }
                            </View>
                          </View>

    return (
      <View className="container">
        <View className="btn-show-dialog" onClick={this.showAddModal}><i class="foton-ui plus"></i>绑定车联网账号</View>
        <View className="list-wrapper">
          <Text className="h">请选择您要进入的企业平台</Text>
          <View className="list clearfix">
            {platformViews}
          </View>
          { selectedPlatform && <Button className="btn-blue" onClick={this.loginTo}>进入</Button> }
        </View>
        {this.state.isShowAddPlatformDialog && addPlatformView}
      </View>
    )
  }

  onInputUserName (e) {
    this.setState({
      newPlatformUserName: e.detail.value.trim()
    });
  }
  onInputPassword (e) {
    this.setState({
      newPlatformPassword: e.detail.value.trim()
    });
  }
  onInputCode (e) {
    this.setState({
      newPlatformCode: e.detail.value.trim()
    });
  }

  async loginTo () {
    let result = await passportService.login({
      unionId: this.state.selectedPlatform.unionId
    });

    if (result.code !== 200) {
      toast.error(result.msg);
      return;
    } else {
      toast.success('登录成功');
    }
    await this.props.asyncProfileInfo();
    // return;
    Taro.switchTab({
      url: '/pages/index'
    });
  }
  selectPlatform (item) {
    this.setState({
      selectedPlatform: item
    });
  }
  async removePlatform (item) {
    let res = await Taro.showModal({
      title: '删除账号',
      content: '您确定要删除该账号吗？',
      confirmText: '删除',
      cancelText: '取消'
    });
    if (res.confirm) {
      Taro.showLoading({
        title: '提交中'
      });
      let result = await profileService.removePlatform({
        unionId: item.unionId
      });
      toast.showByResult(result);
      await this.bindPlatforms();
      Taro.hideLoading();
    }
  }
  showAddModal () {
    this.setState({
      isShowAddPlatformDialog: true
    });
  }
  hideModal () {
    this.setState({
      isShowAddPlatformDialog: false
    });
  }
  touristPlatform () {
    this.plarformLoad('weixin_KqmCU3', 'foton123', 'demo');
  }

  async addPlatform () {
    this.setState({
      enableValidate: true
    });
    if (this.state.newPlatformCode.length === 0 || this.state.newPlatformUserName.length === 0 || this.state.newPlatformPassword.length === 0) {
      return;
    }
    this.setState({
      enableValidate: false
    });
    this.plarformLoad(this.state.newPlatformUserName, this.state.newPlatformPassword, this.state.newPlatformCode);
  }
  async plarformLoad (userName, password, code) {
    Taro.showLoading({
      title: '保存中'
    });
    let result = await profileService.addPlatform({
      companyNo: code,
      username: userName,
      password: password
    });
    if (result.code !== 200) {
      this.setState({
        formErrorMsg: result.msg
      });
      Taro.hideLoading();
    } else {
      Taro.hideLoading();
      await this.bindPlatforms();
      if (userName === 'weixin_KqmCU3' && password === 'foton123' && code === 'demo') {
        Taro.switchTab({
          url: '/pages/index'
        });
      }
      if (this.state.platforms.length !== 0) {
        this.hideModal();
      }
    }
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default PlatformManager as ComponentClass<PageOwnProps, PageState>
