import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import './summary.scss'
import summaryImg1 from '../../assets/index/icon1-1.svg'
import summaryImg2 from '../../assets/index/icon1-2.svg'
import summaryImg3 from '../../assets/index/icon1-3.svg'
import summaryImg4 from '../../assets/index/icon1-4.svg'
import summaryImg5 from '../../assets/index/icon1-5.svg'
import summaryImg6 from '../../assets/index/icon1-6.png'
interface SummaryPropTypes {
  numData?: object
}

export default class Summary extends Component<SummaryPropTypes> {
  static defaultProps = {
    numData: []
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { numData } = this.props;
    return(
      <View className="summary-content">
        <ul>
          <li>
            <Image className="summary-img" src={summaryImg1}/>
            <View className="summary-num">{numData[0]}</View>
            <Text className="summary-title">所有车辆</Text>
          </li>
          <li>
            <Image className="summary-img" src={summaryImg2}/>
            <View className="summary-num">{numData[1]}</View>
            <Text className="summary-title">今日在线</Text>
          </li>
          <li>
            <Image className="summary-img" src={summaryImg3}/>
            <View className="summary-num">{numData[2]}</View>
            <Text className="summary-title">今日离线</Text>
          </li>
          <li>
            <Image className="summary-img" src={summaryImg4}/>
            <View className="summary-num">{numData[3]}</View>
            <Text className="summary-title">当前行驶</Text>
          </li>
          <li>
            <Image className="summary-img" src={summaryImg5}/>
            <View className="summary-num">{numData[4]}</View>
            <Text className="summary-title">当前停车</Text>
          </li>
          <li>
            <Image className="summary-img" src={summaryImg6}/>
            <View className="summary-num">{numData[5]}</View>
            <Text className="summary-title">今日注册</Text>
          </li>
        </ul>
      </View>
    );
  }
}