import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import CarService from '../../../services/car';

import './warn-info.scss'
interface WarnInfoPropTypes {
  carId?: string
}

export default class WarnInfo extends Component<WarnInfoPropTypes> {
  static defaultProps = {
    carId: null
  }

  state = {
    wranInfo: [],
    // remindOneOrTwo: []
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount () {
    this.getWarnInfo()
  }

  async getWarnInfo() {
    let res = await CarService.getWarnInfo({carId: this.props.carId, typeCode: 2004});
    if (!res.list || res.list.length === 0) {
      return;
    }
    let wranInfo = res.list;
    // let remindOneOrTwo = res.list.length % 2 === 1 ? 'one' : 'two';
    console.log('WarnInfo retult:', wranInfo)
    this.setState({
      wranInfo: wranInfo,
      // remindOneOrTwo: remindOneOrTwo
    })
  }

  render () {
    let { wranInfo } = this.state;
    if (!wranInfo) return

    let warnContent = null;
    if (wranInfo.length !== 0) {
      warnContent = wranInfo.map((item, index) => {
        return <View className="item warn-item clearfix" key={index}>
        <View className="name fl">{item.name}</View>
        <View className="fr">
          <View className="warn-icon">报警</View>
        </View>
      </View>
      })
    } else {
      warnContent = <View className="no-wran">车况良好，无报警信息！</View>
    }
    return(
      <View className="part wran">
        <View className="part-title"><Text>报警信息</Text></View>
        <View className="part-main">
          {warnContent}
        </View>
      </View>
    );
  }
}