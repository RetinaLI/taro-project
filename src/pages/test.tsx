import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Form, Text, Input, Button } from '@tarojs/components'

import Child from '../base-components/child';

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
    label: '11111111',
    list: [
      {a:1}
    ]
  }


  componentWillReceiveProps (nextProps) {
  }

  componentWillMount () {
  }

  componentDidMount () {

  }
  componentWillUnmount () { }

  componentDidShow () {
    setTimeout(() => {
      this.setState({
        label: '123123123123213',
        list: [
          {a: 2}
        ]
      });

    }, 3000);
  }

  componentDidHide () { }

  render () {
    return (
      <View>
        <Child label={this.state.label} list={this.state.list}></Child>
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

export default Login as ComponentClass<PageOwnProps, PageState>
