import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Form, Text, Input, Button } from '@tarojs/components'
// import { AtForm, AtInput, AtButton } from 'taro-ui'
import PassportService from '../services/passport'
// import { connect } from '@tarojs/redux'


import './login.scss'
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

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface Login {
  props: IProps;
}

// @connect(({ profile }) => ({
//   profile: profile.profile,
//   platform: profile.platform
// }))

class Login extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '登录页',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  // constructor () {
  //   super(...arguments)
  //   this.state = {
  //     value: ''
  //   }
  // }

  state = {
    value: '',
    newPlatform: {
      companyNo: '',
      username: '',
      password: ''
    }
  }


  componentWillReceiveProps (nextProps) {
    // console.log('index', this.props, nextProps);
  }

  componentWillMount () {
  }

  componentDidMount () {

  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  async formSubmit (e) {
    console.log('value', e.detail.value)
    let value = e.detail.value;
    let result = await PassportService.loginH5({
      loginResult: 'login',
      username: value.username,
      password: value.password,
      companyNo: value.companyNo
    });
    console.log('result', result)
  }

  formReset () {

  }

  render () {
    let { newPlatform } = this.state;
    return (
      <View>
        <Form onSubmit={this.formSubmit} onReset={this.formReset} >
          <View className='login-box'>
            <Text className="label">用户名：</Text>
            <Input type='text' placeholder='请输入用户名' focus name="username" value={newPlatform.username}/>
            <Text className="label">密码：</Text>
            <Input type='password' password placeholder='请输入密码' name="password" value={newPlatform.password}/>
            <Text className="label">企业代码：</Text>
            <Input type='text' placeholder='请输入企业代码' name="companyNo" value={newPlatform.companyNo}/>
            <Button className='btn-max-w' plain type='primary'>登陆</Button>
          </View>
        </Form>
      </View>

      // <AtForm
      //   onSubmit={this.onSubmit.bind(this)}
      //   onReset={this.onReset.bind(this)}
      // >
      //   <AtInput
      //     name='value'
      //     title='文本'
      //     type='text'
      //     placeholder='单行文本'
      //     value={this.state.value}
      //     onChange={this.handleChange.bind(this)}
      //   />
      //   <AtButton formType='submit'>提交</AtButton>
      //   <AtButton formType='reset'>重置</AtButton>
      // </AtForm>
    )
  }

}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Login as ComponentClass<PageOwnProps, PageState>
