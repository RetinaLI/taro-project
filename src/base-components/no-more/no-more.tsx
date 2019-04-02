import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './no-more.scss'
interface NoMorePropTypes {

}

export default class NoMore extends Component<NoMorePropTypes> {

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    return(
      <View className="flex no-nore-box">
        <View className="line"></View>
        <View className="txt">没有更多啦</View>
        <View className="line"></View>
      </View>
    );
  }
}